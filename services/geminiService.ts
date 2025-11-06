import { GoogleGenAI, Type } from "@google/genai";
import { BirthBlueprint, SynchronicityLog, Interpretation, DreamLog } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBirthBlueprint = async (fullName: string, date: string, time: string, place: string): Promise<BirthBlueprint> => {
  const prompt = `
    Based on the following birth details:
    - Full Name at Birth: ${fullName}
    - Date of Birth: ${date}
    - Time of Birth: ${time}
    - Place of Birth: ${place}

    Calculate and provide the following information. Be as accurate as possible. Use Pythagorean numerology for name calculations. Reduce all numerology numbers to a single digit unless they are master numbers (11, 22, 33).
    1.  Full Name: The user's full name as provided.
    2.  Life Path Number (from Date of Birth).
    3.  Expression (or Destiny) Number (from full name).
    4.  Soul Urge (or Heart's Desire) Number (from vowels in full name).
    5.  Personality Number (from consonants in full name).
    6.  Western Astrology: Sun Sign.
    7.  Western Astrology: Moon Sign.
    8.  Western Astrology: Rising Sign (Ascendant).
    9.  Chinese Zodiac: Animal Sign.
    10. Chinese Zodiac: Element for that birth year.

    Return ONLY the JSON object with the specified schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING, description: "The user's full name at birth." },
            lifePathNumber: { type: Type.INTEGER, description: "The user's Life Path Number." },
            expressionNumber: { type: Type.INTEGER, description: "The user's Expression (Destiny) Number from their full name." },
            soulUrgeNumber: { type: Type.INTEGER, description: "The user's Soul Urge (Heart's Desire) Number from the vowels in their name." },
            personalityNumber: { type: Type.INTEGER, description: "The user's Personality Number from the consonants in their name." },
            sunSign: { type: Type.STRING, description: "The user's Sun sign." },
            moonSign: { type: Type.STRING, description: "The user's Moon sign." },
            risingSign: { type: Type.STRING, description: "The user's Rising sign (Ascendant)." },
            chineseZodiac: { type: Type.STRING, description: "The user's Chinese Zodiac animal." },
            chineseZodiacElement: { type: Type.STRING, description: "The element of the user's Chinese Zodiac year." },
          },
          required: ["fullName", "lifePathNumber", "expressionNumber", "soulUrgeNumber", "personalityNumber", "sunSign", "moonSign", "risingSign", "chineseZodiac", "chineseZodiacElement"],
        },
      },
    });

    const jsonText = response.text.trim();
    const blueprint = JSON.parse(jsonText) as BirthBlueprint;
    return blueprint;
  } catch (error) {
    console.error("Error generating birth blueprint:", error);
    throw new Error("Failed to generate birth blueprint from Gemini API.");
  }
};

export const generateInterpretation = async (log: SynchronicityLog, blueprint: BirthBlueprint): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide named SynchroMap. You specialize in fusing Western Astrology, Numerology, and the Chinese Zodiac to provide personalized interpretations of synchronicities.

    A user has the following personal "Birth Blueprint":
    - Full Name: ${blueprint.fullName}
    - Life Path Number: ${blueprint.lifePathNumber}
    - Expression Number: ${blueprint.expressionNumber}
    - Soul Urge Number: ${blueprint.soulUrgeNumber}
    - Personality Number: ${blueprint.personalityNumber}
    - Sun Sign: ${blueprint.sunSign}
    - Moon Sign: ${blueprint.moonSign}
    - Rising Sign: ${blueprint.risingSign}
    - Chinese Zodiac: ${blueprint.chineseZodiac} (${blueprint.chineseZodiacElement})

    They just experienced and logged the following synchronicity:
    "${log.description}"

    Your task is to provide a deep, personalized, and encouraging interpretation in two parts: a brief summary and a full detailed interpretation.
    
    1.  **Summary**: A concise, one or two-sentence summary of the core message.
    2.  **Full Interpretation**: A detailed explanation.
        - Start by acknowledging the synchronicity.
        - Explain its general meaning (e.g., the numerological meaning of a number, the symbolism of an animal).
        - Crucially, connect this general meaning DIRECTLY to the user's Birth Blueprint. Use any and all parts of the blueprint, including their name numerology. For example: "Seeing 444 is significant for you, as it resonates with your Life Path ${blueprint.lifePathNumber}, but it also reflects the practical nature of your Expression number ${blueprint.expressionNumber}, urging you to build tangible foundations." or "This animal guide appearing now speaks to your inner desires, a theme central to your Soul Urge number ${blueprint.soulUrgeNumber}."
        - Offer a piece of gentle guidance or a question for reflection based on this unique connection.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, italics) in the full interpretation.

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief, one or two-sentence summary of the interpretation." },
                        fullInterpretation: { type: Type.STRING, description: "The full, detailed interpretation in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating interpretation:", error);
        throw new Error("Failed to generate interpretation from Gemini API.");
    }
};

export const generateDreamInterpretation = async (dream: DreamLog, blueprint: BirthBlueprint): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful dream interpreter named SynchroMap. You specialize in fusing Western Astrology, Numerology, and the Chinese Zodiac to provide personalized interpretations of dreams.

    A user has the following personal "Birth Blueprint":
    - Full Name: ${blueprint.fullName}
    - Life Path Number: ${blueprint.lifePathNumber}
    - Expression Number: ${blueprint.expressionNumber}
    - Soul Urge Number: ${blueprint.soulUrgeNumber}
    - Personality Number: ${blueprint.personalityNumber}
    - Sun Sign: ${blueprint.sunSign}
    - Moon Sign: ${blueprint.moonSign}
    - Rising Sign: ${blueprint.risingSign}
    - Chinese Zodiac: ${blueprint.chineseZodiac} (${blueprint.chineseZodiacElement})

    They just had the following dream:
    "${dream.description}"

    Your task is to provide a deep, personalized, and encouraging interpretation of the dream in two parts: a brief summary and a full detailed interpretation.
    
    1.  **Summary**: A concise, one or two-sentence summary of the core message or theme of the dream.
    2.  **Full Interpretation**: A detailed explanation.
        - Start by acknowledging the dream's core themes and symbols.
        - Explain the general psychological or archetypal meaning of these symbols (e.g., water symbolizing emotions, flying symbolizing freedom).
        - **Crucially**, connect these dream symbols DIRECTLY to the user's Birth Blueprint. Use any and all parts of the blueprint. For example: "The theme of transformation in your dream, symbolized by the butterfly, is particularly potent for you now. It speaks directly to your ${blueprint.sunSign} Sun's current journey and resonates with the creative potential of your Expression number ${blueprint.expressionNumber}." or "The feeling of being lost in the dream might reflect a challenge to your Life Path ${blueprint.lifePathNumber}, which is all about finding your unique direction. Your ${blueprint.moonSign} Moon suggests this is an emotional, not just a logical, journey for you."
        - Offer gentle guidance or a question for reflection based on this unique connection.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, italics) in the full interpretation.

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief, one or two-sentence summary of the interpretation." },
                        fullInterpretation: { type: Type.STRING, description: "The full, detailed interpretation in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating dream interpretation:", error);
        throw new Error("Failed to generate dream interpretation from Gemini API.");
    }
};

export const generateBlueprintInterpretation = async (blueprint: BirthBlueprint): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide named SynchroMap. You are interpreting a user's complete Birth Blueprint.

    The user's blueprint is:
    - Full Name: ${blueprint.fullName}
    - Life Path Number: ${blueprint.lifePathNumber} (Core purpose from birth date)
    - Expression Number: ${blueprint.expressionNumber} (Destiny and talents from name)
    - Soul Urge Number: ${blueprint.soulUrgeNumber} (Inner desires from name's vowels)
    - Personality Number: ${blueprint.personalityNumber} (Outer self from name's consonants)
    - Sun Sign: ${blueprint.sunSign} (Ego, essence, and core identity)
    - Moon Sign: ${blueprint.moonSign} (Emotional nature, inner world)
    - Rising Sign: ${blueprint.risingSign} (Social persona, how they appear to others)
    - Chinese Zodiac: ${blueprint.chineseZodiac} (${blueprint.chineseZodiacElement}) (Yearly energy, fundamental characteristics)

    Your task is to provide a holistic interpretation of how these different aspects work together. Explain the core energies and how they might manifest in the user's life.
    
    1.  **Summary**: A concise, two-to-three sentence overview of the user's core energetic signature, summarizing the main theme of their blueprint.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - Start with an empowering opening statement about their unique cosmic makeup.
        - Individually explain the core theme of each component (Life Path, Expression, Soul Urge, Personality, Sun, Moon, Rising, Zodiac).
        - **Crucially**, highlight the synergies or points of tension between these elements. For example: "Your **Life Path ${blueprint.lifePathNumber}** focused on structure is beautifully complemented by your **Expression number ${blueprint.expressionNumber}**, which gives you the natural talents to build that structure effectively." or "Your inner world, described by your **${blueprint.moonSign} Moon** and **Soul Urge ${blueprint.soulUrgeNumber}**, may sometimes feel private compared to the outgoing persona of your **${blueprint.risingSign} Rising** and **Personality Number ${blueprint.personalityNumber}**."
        - Conclude with an encouraging message about how understanding these dynamics can empower them on their life path.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting.

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the blueprint's core energetic signature." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed interpretation of the blueprint in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating blueprint interpretation:", error);
        throw new Error("Failed to generate blueprint interpretation from Gemini API.");
    }
};

export const generateLifePathInterpretation = async (lifePath: number, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and numerologist named SynchroMap. You are interpreting the deeper metaphysical meaning of a specific Life Path number for a user.

    The user is named ${name} and has a **Life Path Number of ${lifePath}**.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to be a Life Path ${lifePath}.
    
    1.  **Summary**: A concise, two-sentence summary of the core essence and purpose of a Life Path ${lifePath}.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **Core Essence**: Start with the primary theme and keyword for this number (e.g., "The Leader" for 1, "The Builder" for 4, "The Spiritual Teacher" for 7).
        - **Strengths & Natural Talents**: Describe the positive traits and innate gifts of someone with this Life Path. Be specific and provide examples.
        - **Challenges & Life Lessons**: Gently explain the potential struggles, shadow aspects, or key lessons this person is here to learn. Frame them as opportunities for growth.
        - **Metaphysical Purpose**: Discuss the higher spiritual or soul-level purpose of this Life Path. What is their ultimate contribution to the world?
        - **Affirmation**: Conclude with a powerful, positive affirmation that the user can take with them.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, lists, italics).

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Life Path number's core essence." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Life Path number in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Life Path interpretation:", error);
        throw new Error("Failed to generate Life Path interpretation from Gemini API.");
    }
};

export const generateExpressionInterpretation = async (expressionNumber: number, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and numerologist named SynchroMap. You are interpreting the deeper metaphysical meaning of an Expression (or Destiny) number for a user.

    The user is named ${name} and has an **Expression Number of ${expressionNumber}**. This number is derived from all the letters in their full birth name and represents their natural talents, abilities, and the destiny they are meant to fulfill.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to have an Expression number of ${expressionNumber}.
    
    1.  **Summary**: A concise, two-sentence summary of the core talents and destiny associated with Expression number ${expressionNumber}.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **Core Essence & Purpose**: Start with the primary theme of this number as a destiny path (e.g., "The Creative Communicator" for 3, "The Visionary Leader" for 8, "The Humanitarian" for 9).
        - **Innate Talents & Abilities**: Describe the specific gifts and skills this person naturally possesses. How are they meant to "express" themselves in the world?
        - **Path to Fulfillment**: Explain what this person needs to do or focus on to feel fulfilled and live up to their potential. What kind of work or life suits them?
        - **Potential Challenges**: Gently describe the potential pitfalls or underdeveloped aspects of this Expression number they should be mindful of.
        - **Affirmation**: Conclude with a powerful, positive affirmation related to their unique talents and destiny.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting.

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Expression number's core talents and destiny." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Expression number in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Expression interpretation:", error);
        throw new Error("Failed to generate Expression interpretation from Gemini API.");
    }
};

export const generateSoulUrgeInterpretation = async (soulUrgeNumber: number, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and numerologist named SynchroMap. You are interpreting the deeper metaphysical meaning of a Soul Urge (or Heart's Desire) number for a user.

    The user is named ${name} and has a **Soul Urge Number of ${soulUrgeNumber}**. This number is derived from the vowels in their full birth name and represents their deepest motivations, inner desires, and what truly fulfills their heart.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to have a Soul Urge number of ${soulUrgeNumber}.
    
    1.  **Summary**: A concise, two-sentence summary of the core inner desire and motivation associated with Soul Urge number ${soulUrgeNumber}.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **The Heart's Desire**: Start by explaining the primary craving or motivation of this number (e.g., "A deep need for harmony and partnership" for 2, "A thirst for freedom and adventure" for 5, "A desire for emotional connection and responsibility" for 6).
        - **Inner Motivations**: Describe what drives this person from a soul level. What do they value most in life, even if they don't always show it?
        - **How to Find Fulfillment**: Offer guidance on what activities, relationships, and environments will satisfy their soul's longing and bring them true happiness.
        - **Potential Inner Conflicts**: Gently explain the potential challenges, such as a conflict between their inner desires and their outer life, or a tendency to suppress their true needs.
        - **Affirmation**: Conclude with a powerful, positive affirmation that validates their heart's desire.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting.

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Soul Urge number's core inner desire." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Soul Urge number in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Soul Urge interpretation:", error);
        throw new Error("Failed to generate Soul Urge interpretation from Gemini API.");
    }
};

export const generatePersonalityInterpretation = async (personalityNumber: number, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and numerologist named SynchroMap. You are interpreting the deeper metaphysical meaning of a Personality number for a user.

    The user is named ${name} and has a **Personality Number of ${personalityNumber}**. This number is derived from the consonants in their full birth name and represents their outer self, how others perceive them, and the first impression they make. It's the "window dressing" of their soul.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to have a Personality number of ${personalityNumber}.
    
    1.  **Summary**: A concise, two-sentence summary of the outward persona and first impression associated with Personality number ${personalityNumber}.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **The Outer Self**: Start by describing the primary vibe or persona this number projects (e.g., "Competent and dependable" for 4, "Charming and sociable" for 3, "Mysterious and introspective" for 7).
        - **First Impressions**: Explain how this person comes across to others in social or professional settings. What do people first notice about them?
        - **How You Present Yourself**: Describe the style, mannerisms, and general demeanor associated with this number.
        - **Relationship to Inner Self**: Briefly touch on how this outer personality might relate to their inner numbers (like their Soul Urge). Is it a protective shell or an accurate reflection?
        - **Affirmation**: Conclude with a powerful, positive affirmation that embraces their unique outer expression.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting.

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Personality number's outward persona." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Personality number in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Personality interpretation:", error);
        throw new Error("Failed to generate Personality interpretation from Gemini API.");
    }
};

export const generateSunSignInterpretation = async (sunSign: string, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and astrologer named SynchroMap. You are interpreting the deeper meaning of a specific Sun Sign for a user.

    The user is named ${name} and has a **Sun Sign of ${sunSign}**. The Sun Sign represents their core identity, ego, and the fundamental essence of their being.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to be a ${sunSign}.
    
    1.  **Summary**: A concise, two-sentence summary of the core essence and life purpose associated with the ${sunSign} Sun sign.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **Core Essence & Archetype**: Start with the primary theme and archetype for this sign (e.g., "The Pioneer" for Aries, "The Nurturer" for Cancer, "The Visionary" for Aquarius).
        - **Strengths & Gifts**: Describe the positive traits, innate talents, and how their light shines in the world.
        - **Challenges & Shadows**: Gently explain the potential struggles, shadow aspects, or key life lessons for a ${sunSign}. Frame them as opportunities for growth toward their highest expression.
        - **Path to Radiance**: Discuss how they can best express their sun sign's energy to feel vital, fulfilled, and authentic.
        - **Affirmation**: Conclude with a powerful, positive affirmation that resonates with the ${sunSign} energy.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, lists, italics).

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Sun Sign's core essence." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Sun Sign in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Sun Sign interpretation:", error);
        throw new Error("Failed to generate Sun Sign interpretation from Gemini API.");
    }
};

export const generateMoonSignInterpretation = async (moonSign: string, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and astrologer named SynchroMap. You are interpreting the deeper meaning of a specific Moon Sign for a user.

    The user is named ${name} and has a **Moon Sign of ${moonSign}**. The Moon Sign represents their emotional nature, inner world, subconscious self, and what they need to feel safe and nurtured.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to have a Moon in ${moonSign}.
    
    1.  **Summary**: A concise, two-sentence summary of the core emotional needs and inner world of a ${moonSign} Moon.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **Emotional Core & Inner World**: Start with the primary theme of their emotional landscape (e.g., "A need for emotional freedom" for Aquarius, "A deep well of empathy" for Pisces, "Passionate and intense feelings" for Scorpio).
        - **Strengths & Emotional Gifts**: Describe the positive traits of their emotional nature. How do they express and handle feelings in a healthy way?
        - **Challenges & Shadow Side**: Gently explain the potential emotional struggles, reactive tendencies, or key lessons for a ${moonSign} Moon. Frame them as opportunities for emotional maturity.
        - **Path to Emotional Fulfillment**: Discuss what this person needs in their environment and relationships to feel emotionally secure, understood, and nurtured.
        - **Affirmation**: Conclude with a powerful, positive affirmation that honors their unique emotional nature.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, lists, italics).

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Moon Sign's core emotional needs." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Moon Sign in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Moon Sign interpretation:", error);
        throw new Error("Failed to generate Moon Sign interpretation from Gemini API.");
    }
};

export const generateRisingSignInterpretation = async (risingSign: string, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide and astrologer named SynchroMap. You are interpreting the deeper meaning of a specific Rising Sign (or Ascendant) for a user.

    The user is named ${name} and has a **Rising Sign of ${risingSign}**. The Rising Sign represents their social persona, how they appear to others, their first impression, and the lens through which they view and approach life.

    Your task is to provide a deep, inspiring, and comprehensive explanation of what it means to have a ${risingSign} Rising.
    
    1.  **Summary**: A concise, two-sentence summary of the social persona and approach to life of someone with a ${risingSign} Rising.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **The Social Mask & Persona**: Start by describing the primary energy they project to the world (e.g., "Energetic and direct" for Aries, "Grounded and graceful" for Taurus, "Curious and communicative" for Gemini).
        - **First Impressions**: Explain how this person comes across when meeting new people. What is their outward demeanor and style?
        - **Approach to Life**: Describe how their Rising sign influences the way they initiate things and navigate new experiences. It's their "default" mode of operation.
        - **Path of Development**: Gently explain that the Rising Sign also points to qualities they are meant to develop and integrate throughout their life.
        - **Affirmation**: Conclude with a powerful, positive affirmation that embraces the energy of their Ascendant.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, lists, italics).

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Rising Sign's social persona." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Rising Sign in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Rising Sign interpretation:", error);
        throw new Error("Failed to generate Rising Sign interpretation from Gemini API.");
    }
};


export const generateChineseZodiacInterpretation = async (zodiac: string, element: string, name: string): Promise<Interpretation> => {
    const prompt = `
    Act as a wise, insightful spiritual guide specializing in Eastern Astrology named SynchroMap. You are interpreting the deeper meaning of a user's Chinese Zodiac sign.

    The user is named ${name} and their Chinese Zodiac sign is the **${element} ${zodiac}**.

    Your task is to provide a deep, inspiring, and comprehensive explanation of this specific combination.
    
    1.  **Summary**: A concise, two-sentence summary of the core personality traits of an ${element} ${zodiac}.
    2.  **Full Interpretation**: A detailed breakdown in markdown format.
        - **Core Archetype**: Start by describing the fundamental nature of the ${zodiac} animal (e.g., "The clever Rat," "The steadfast Ox," "The courageous Tiger").
        - **The Influence of the ${element} Element**: Crucially, explain how the ${element} element (Wood, Fire, Earth, Metal, or Water) modifies and influences the ${zodiac}'s core traits. For example, a "Fire Dragon" is more intense and passionate than a "Wood Dragon," which is more creative and collaborative.
        - **Strengths & Virtues**: Describe the positive qualities and talents that arise from this unique animal-element combination.
        - **Challenges & Considerations**: Gently explain the potential weaknesses, struggles, or shadow aspects they should be mindful of for personal growth.
        - **Life Path & Relationships**: Briefly touch upon what kind of life path, career, and relationship dynamics might suit this person.
        - **Affirmation**: Conclude with a powerful, positive affirmation that captures the spirit of the ${element} ${zodiac}.
        - Keep the tone mystical, supportive, and empowering. Use markdown for formatting (bolding, lists, italics).

    Return ONLY the JSON object with the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A brief summary of the Chinese Zodiac sign's personality." },
                        fullInterpretation: { type: Type.STRING, description: "A full, detailed metaphysical interpretation of the Chinese Zodiac sign in markdown format." }
                    },
                    required: ["summary", "fullInterpretation"]
                }
            }
        });

        const jsonText = response.text.trim();
        const interpretation = JSON.parse(jsonText) as Interpretation;
        return interpretation;
    } catch (error) {
        console.error("Error generating Chinese Zodiac interpretation:", error);
        throw new Error("Failed to generate Chinese Zodiac interpretation from Gemini API.");
    }
};
