import axios from "axios";

const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are the MysticPool Oracle, an AI-powered DeFi analyst specialized in Uniswap v4 dynamic fee optimization. You analyze market data, volatility patterns, cross-chain signals, and liquidity metrics to recommend optimal swap fees.

Your role:
- Analyze trading patterns and market conditions for Uniswap v4 pools
- Recommend dynamic fee adjustments (between 0.01% and 1%) based on volatility
- Interpret cross-chain signals from Reactive Network to detect arbitrage opportunities
- Protect liquidity providers during high-volatility periods by recommending higher fees
- Attract trading volume during calm markets with lower fees
- Provide clear, data-driven explanations for your recommendations

When analyzing market data, consider:
1. Recent swap volume and frequency
2. Price volatility (standard deviation of recent prices)
3. Liquidity depth and concentration
4. Cross-chain arbitrage signals
5. Gas costs and MEV risk

Always respond with actionable insights. When asked for fee recommendations, provide:
- Recommended fee (in basis points)
- Confidence level (low/medium/high)
- Key factors driving the recommendation
- Risk assessment for LPs

Format currency values clearly and use DeFi terminology appropriately. Refer to yourself as the MysticPool Oracle.`;

export class NvidiaAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = process.env.NVIDIA_MODEL || "qwen/qwen3.5-122b-a10b";
  }

  async chat(userMessage, conversationHistory = []) {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    try {
      const response = await axios.post(
        INVOKE_URL,
        {
          model: this.model,
          messages,
          max_tokens: 4096,
          temperature: 0.6,
          top_p: 0.95,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: "application/json",
          },
          timeout: 60000,
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model,
      };
    } catch (error) {
      console.error("NVIDIA API Error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  async analyzeFees(poolData) {
    const prompt = `Analyze the following Uniswap v4 pool data and recommend an optimal dynamic fee:

Pool Data:
- Token Pair: ${poolData.tokenPair}
- Current Fee: ${poolData.currentFee} bps
- 24h Volume: $${poolData.volume24h.toLocaleString()}
- 24h Swap Count: ${poolData.swapCount}
- Liquidity (TVL): $${poolData.tvl.toLocaleString()}
- Price Change 24h: ${poolData.priceChange24h}%
- Volatility Index: ${poolData.volatilityIndex}/100
- Cross-Chain Signals: ${JSON.stringify(poolData.crossChainSignals || [])}

Provide your analysis as JSON with the following structure:
{
  "recommendedFee": <number in bps>,
  "confidence": "<low|medium|high>",
  "volatilityAssessment": "<low|moderate|high|extreme>",
  "reasoning": "<brief explanation>",
  "riskLevel": "<low|medium|high>",
  "expectedImpact": {
    "lpReturn": "<expected change>",
    "volumeChange": "<expected change>"
  }
}`;

    const result = await this.chat(prompt);

    if (result.success) {
      try {
        const jsonMatch = result.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { success: true, analysis: parsed, raw: result.message };
        }
      } catch {
        // If JSON parse fails, return raw response
      }
      return { success: true, analysis: null, raw: result.message };
    }
    return result;
  }

  async analyzeReactiveSignal(signalData) {
    const prompt = `A cross-chain signal was received via Reactive Network. Analyze its impact on our Uniswap v4 pool fee strategy:

Signal Data:
- Source Chain: ${signalData.sourceChain}
- Source Pool: ${signalData.sourcePool}
- 24h Volume on Source: $${signalData.volume24h.toLocaleString()}
- Price Impact: ${signalData.priceImpact}%
- Our Current Fee: ${signalData.currentFee} bps
- Our Pool TVL: $${signalData.tvl.toLocaleString()}

Is there an arbitrage opportunity? Should we adjust fees to capture it or protect against it?

Respond with JSON:
{
  "arbitrageDetected": <boolean>,
  "urgency": "<low|medium|high|critical>",
  "feeAdjustment": <suggested bps change, positive to increase, negative to decrease>,
  "reasoning": "<explanation>",
  "crossChainRisk": "<assessment>"
}`;

    return this.chat(prompt);
  }
}
