import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileData {
  id: string;
  full_name: string;
  profile_photo_url: string | null;
  city: string;
  area: string;
  interests: string[] | null;
  child_age_group?: string;
  children?: { age?: string; ageGroup?: string; gender?: string; name?: string }[];
  bio?: string;
  last_seen_at?: string;
  marital_status?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { currentProfile, potentialMatches, language } = await req.json();

    if (!currentProfile || !potentialMatches || potentialMatches.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "No profiles available", 
          matches: [],
          noProfiles: true 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the prompt for AI analysis with detailed profile comparison
    type ChildData = { age?: string; ageGroup?: string; gender?: string; name?: string };
    const currentChildren: ChildData[] = currentProfile.children || [];
    const currentInterests: string[] = currentProfile.interests || [];
    const currentMaritalStatus = currentProfile.marital_status || '';
    const currentChildAges = currentChildren.map((c: ChildData) => c.ageGroup || c.age).filter(Boolean);
    
    const systemPrompt = `You are a friendly matchmaking assistant for a mom community app called Momster. 
Your job is to analyze mom profiles and find the BEST available match based on ACTUAL SIMILARITIES in their profiles.

CRITICAL RULES:
- ALWAYS select a match from the list - never say "no match found"
- Never mention "AI" or "algorithm" - speak as if you're a caring friend who knows both moms
- Generate warm, human reasons for the match in ${language === 'el' ? 'Greek' : 'English'}
- Focus on REAL similarities you can see in the profiles:
  * Same/similar children ages (e.g., both have toddlers, both have newborns)
  * Shared interests (e.g., both like yoga, cooking, reading)
  * Same marital status if single mom (e.g., "Είστε και οι δύο single mamas!")
  * Same location/area
  * Similar lifestyle indicators
- DO NOT claim similarities that don't exist in the data!
- Scores: 60-75 = potential, 75-85 = good, 85+ = great match

Examples of GOOD reasons (${language === 'el' ? 'Greek' : 'English'}):
${language === 'el' ? `
- "Τα παιδάκια σας είναι στην ίδια ηλικία - τέλεια για playdate!"
- "Είστε και οι δύο single mamas! 💪"  
- "Σας αρέσει και στις δύο η γιόγκα 🧘"
- "Μοιράζεστε την αγάπη για το μαγείρεμα! 🍳"
- "Είστε στην ίδια γειτονιά!"
- "Και οι δύο έχετε νεογέννητα - θα έχετε πολλά να μοιραστείτε! 👶"
` : `
- "Your kids are the same age - perfect for playdates!"
- "You're both single mamas! 💪"
- "You both love yoga 🧘"
- "You share a love for cooking! 🍳"
- "You're in the same neighborhood!"
- "You both have newborns - so much to share! 👶"
`}`;

    // Build detailed profile comparison data
    const currentProfileDetails = {
      interests: currentInterests,
      childAges: currentChildAges,
      childAgeGroup: currentProfile.child_age_group,
      maritalStatus: currentMaritalStatus,
      area: currentProfile.area,
      city: currentProfile.city
    };

    const userPrompt = `Find the BEST match based on REAL similarities only.

CURRENT MOM PROFILE:
- Name: ${currentProfile.full_name}
- Location: ${currentProfile.area}, ${currentProfile.city}
- Interests: ${currentInterests.join(', ') || 'Not specified'}
- Children ages: ${currentChildAges.join(', ') || currentProfile.child_age_group || 'Not specified'}
- Marital Status: ${currentMaritalStatus || 'Not specified'}
- Bio: ${currentProfile.bio || 'Not specified'}

POTENTIAL MATCHES:
${potentialMatches.slice(0, 10).map((p: ProfileData, i: number) => {
  const pChildren = p.children || [];
  const pInterests: string[] = p.interests || [];
  const pMarital = p.marital_status || '';
  const commonInterests = currentInterests.filter((int: string) => pInterests.includes(int));
  const childAges = pChildren.map(c => c.ageGroup || c.age).filter(Boolean);
  
  return `
${i + 1}. ${p.full_name}
   - Location: ${p.area}, ${p.city}
   - Interests: ${pInterests.join(', ') || 'Not specified'}
   - Common interests with current: [${commonInterests.join(', ')}]
   - Children ages: ${childAges.join(', ') || p.child_age_group || 'Not specified'}
   - Marital Status: ${pMarital || 'Not specified'}
   - Same area: ${p.area?.toLowerCase() === currentProfile.area?.toLowerCase() ? 'YES' : 'NO'}
   - Same city: ${p.city?.toLowerCase() === currentProfile.city?.toLowerCase() ? 'YES' : 'NO'}
   - Bio: ${p.bio || 'Not specified'}
`;
}).join('\n')}

IMPORTANT: Only mention similarities that ACTUALLY EXIST in the data above. 
If they share interests, mention specific ones. If kids are same age, mention it.
If they're both single moms, mention it. If they're in the same area, mention it.
DO NOT make up similarities!

Return the TOP match with accurate, specific reasons.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "select_best_match",
              description: "Select the best matching mom and provide warm, human reasons",
              parameters: {
                type: "object",
                properties: {
                  selectedProfileIndex: {
                    type: "number",
                    description: "Index (1-based) of the best matching profile from the list"
                  },
                  matchScore: {
                    type: "number",
                    description: "Compatibility score from 60-100. Give higher scores (85+) for great matches, but always find SOMEONE even if score is lower (60-75)."
                  },
                  primaryReason: {
                    type: "string",
                    description: "The main warm, human reason for the match (e.g., 'Τα παιδιά σας είναι στην ίδια φάση!')"
                  },
                  secondaryReasons: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 additional short reasons for the match"
                  },
                  matchType: {
                    type: "string",
                    enum: ["same_stage", "similar_mood", "common_schedule", "shared_interests", "nearby_vibes"],
                    description: "The main type of connection"
                  }
                },
                required: ["selectedProfileIndex", "matchScore", "primaryReason", "secondaryReasons", "matchType"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "select_best_match" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Fallback to first available match if AI fails
      const fallbackProfile = potentialMatches[0];
      const fallbackReason = language === 'el' 
        ? "Είστε στην ίδια πόλη — ίσως να έχετε περισσότερα κοινά απ' όσο νομίζετε! 🌸"
        : "You're in the same city — you might have more in common than you think! 🌸";
      
      return new Response(
        JSON.stringify({ 
          selectedProfile: fallbackProfile,
          matchScore: 70,
          primaryReason: fallbackReason,
          secondaryReasons: [
            language === 'el' ? "Μπορεί να σας εκπλήξει!" : "They might surprise you!"
          ],
          matchType: "nearby_vibes",
          fallback: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    const selectedIndex = result.selectedProfileIndex - 1; // Convert to 0-based
    const selectedProfile = potentialMatches[selectedIndex] || potentialMatches[0];

    return new Response(
      JSON.stringify({
        selectedProfile,
        matchScore: result.matchScore,
        primaryReason: result.primaryReason,
        secondaryReasons: result.secondaryReasons || [],
        matchType: result.matchType
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ai-magic-match:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});