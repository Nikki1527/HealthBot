// Groq API integration for medical AI responses
// Support user-provided API key via localStorage, falling back to default key and local smart clinical responses on failure.

const DEFAULT_GROQ_API_KEY = "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Retrieve API key dynamically from localStorage
const getApiKey = (): string => {
  const savedKey = localStorage.getItem('groq_api_key');
  if (savedKey && savedKey.trim().startsWith('gsk_')) {
    return savedKey.trim();
  }
  return DEFAULT_GROQ_API_KEY;
};

// Local clinical fallback responses for offline state or unauthorized API keys
export const generateLocalFallbackResponse = (messages: GroqMessage[]): string => {
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length === 0) return "Hi, I'm your HealthScribe assistant. How can I help you today?";
  
  const lastUserMessage = userMessages[userMessages.length - 1].content.toLowerCase();

  // 1. Extreme Trauma Fall from Heights
  if (lastUserMessage.includes('fall') && (lastUserMessage.includes('unable to walk') || lastUserMessage.includes('cannot walk') || lastUserMessage.includes('walk') || lastUserMessage.includes('floor'))) {
    return `⚠️ **URGENT EMERGENCY ALERT:** Falling from a height (such as a first floor) and being unable to walk indicates a potential severe trauma, spinal cord injury, or major bone fracture.

**Immediate Action Required:**
1. **Do NOT attempt to stand up, walk, or move.** Moving can cause permanent damage in the event of a spinal fracture.
2. **Call emergency medical services (e.g., 911, 999, or your local emergency number) immediately.**
3. Tell anyone nearby to help keep you still and warm. Do not let anyone move your head or neck.
4. If you have symptoms like numbness, tingling, bleeding, or loss of sensation in your legs, convey this directly to the emergency responders.

*Do not take any medication or eat/drink anything until evaluated by emergency doctors, as you may require urgent imaging or surgery.*`;
  }

  // 2. Chest Pain / Cardiac Emergency
  if (lastUserMessage.includes('chest pain') || lastUserMessage.includes('heart attack') || lastUserMessage.includes('pressure in chest') || lastUserMessage.includes('left arm pain')) {
    return `⚠️ **URGENT EMERGENCY ALERT:** Chest pain, chest pressure, or radiating pain to the left arm/jaw can be a sign of a life-threatening cardiac event (such as a heart attack).

**Immediate Action Required:**
1. **Call emergency services immediately.** Do not wait to see if it passes.
2. Sit down and rest in a comfortable, upright position. Do not exert yourself.
3. If you are not allergic and have no contraindications, chew a full-strength aspirin (325mg) or baby aspirins as recommended by emergency dispatch.
4. If you have prescribed nitroglycerin, take it as directed.

*Do not attempt to drive yourself to the emergency room. Wait for the ambulance.*`;
  }

  // 3. Difficulty Breathing
  if (lastUserMessage.includes('breathing') || lastUserMessage.includes('shortness of breath') || lastUserMessage.includes('suffocat') || lastUserMessage.includes('choking')) {
    return `⚠️ **URGENT EMERGENCY ALERT:** Severe difficulty breathing or shortness of breath is a medical emergency.

**Immediate Action Required:**
1. **Call emergency services immediately.**
2. Sit upright to help maximize your lung capacity. Loosen any tight clothing around your neck or chest.
3. If you have a rescue inhaler (e.g., Albuterol) for asthma or COPD, use it immediately.
4. Try to remain calm and take slow, focused breaths.

*Avoid lying down, as this makes breathing more difficult.*`;
  }

  // 4. Cold, Flu, Cough, Sore Throat
  if (lastUserMessage.includes('cough') || lastUserMessage.includes('cold') || lastUserMessage.includes('flu') || lastUserMessage.includes('sore throat') || lastUserMessage.includes('runny nose') || lastUserMessage.includes('congestion')) {
    return `It sounds like you may be experiencing symptoms of a common respiratory virus, such as a cold, flu, or mild bronchitis.

**General Home Care Suggestions:**
* **Hydration:** Drink plenty of fluids (warm water, herbal tea, broths) to soothe your throat and thin mucus.
* **Rest:** Give your body ample rest so your immune system can fight the virus.
* **Symptom Relief:** Consider over-the-counter options like throat lozenges or saline nasal sprays. You can use acetaminophen or ibuprofen to manage minor aches.
* **Humidifier:** Using a cool-mist humidifier or breathing steam from a warm shower can ease congestion.

**When to see a doctor:**
Consult a healthcare provider if your symptoms last longer than 10 days, if you develop a persistent high fever, or if you begin to experience shortness of breath.`;
  }

  // 5. Fever & Chills
  if (lastUserMessage.includes('fever') || lastUserMessage.includes('chills') || lastUserMessage.includes('temperature') || lastUserMessage.includes('sweating')) {
    return `A fever is a normal sign that your body is active in fighting off an infection.

**General Home Care Suggestions:**
* **Stay Hydrated:** Drink plenty of water or electrolyte replacement drinks.
* **Rest:** Minimize physical exertion.
* **Cool Comfort:** Wear light clothing and rest under a thin sheet. Apply a cool, damp cloth to your forehead.
* **Fever Reducers:** Over-the-counter medications like acetaminophen (Tylenol) or ibuprofen (Advil) can help reduce fever and body aches.

**When to seek immediate care:**
Contact a doctor if the fever exceeds 103°F (39.4°C) in adults, remains high for more than 3 days, or is accompanied by a stiff neck, severe headache, confusion, or difficulty breathing.`;
  }

  // 6. Headache
  if (lastUserMessage.includes('headache') || lastUserMessage.includes('migraine') || lastUserMessage.includes('head pain')) {
    return `Headaches can stem from stress, dehydration, lack of sleep, eye strain, or sinus pressure.

**General Home Care Suggestions:**
* **Rest in Quiet:** Sit or lie down in a quiet, dark, and cool room.
* **Hydration:** Drink a large glass of water, as dehydration is a very common trigger.
* **Cold/Warm Compress:** Apply a cool cloth to your temples/forehead, or a warm heating pad to your neck.
* **OTC Medication:** Acetaminophen, ibuprofen, or aspirin can help alleviate headache pain.

**When to seek immediate care:**
Go to the nearest emergency room if the headache is sudden and extremely severe (described as a "thunderclap" or the worst headache of your life), or if it is accompanied by fever, a stiff neck, confusion, difficulty speaking, numbness, or vision changes.`;
  }

  // 7. Gastrointestinal / Stomach issues
  if (lastUserMessage.includes('stomach') || lastUserMessage.includes('nausea') || lastUserMessage.includes('vomiting') || lastUserMessage.includes('diarrhea') || lastUserMessage.includes('belly')) {
    return `Gastrointestinal symptoms like nausea, vomiting, or diarrhea are frequently caused by viral gastroenteritis ("stomach flu") or mild food irritation.

**General Home Care Suggestions:**
* **Fluid Replacement:** Sip small amounts of water, clear broth, or electrolyte fluids frequently. Do not gulp.
* **Bland Foods:** Once vomiting stops for a few hours, gradually introduce small amounts of bland foods (e.g., Bananas, Rice, Applesauce, Toast - the BRAT diet).
* **Avoid Irritants:** Stay away from dairy, caffeine, alcohol, nicotine, and greasy or spicy foods.

**When to seek medical care:**
Consult a healthcare provider if you cannot keep liquids down for 24 hours, show signs of dehydration (excessive thirst, dry mouth, little to no urination), observe blood in your vomit or stool, or experience severe localized abdominal pain.`;
  }

  // 8. Back Pain
  if (lastUserMessage.includes('back pain') || lastUserMessage.includes('backache') || lastUserMessage.includes('lumbago')) {
    return `Lower back pain is highly common and is most frequently caused by a muscle strain or ligament sprain.

**General Home Care Suggestions:**
* **Keep Moving gently:** Avoid prolonged bed rest, as gentle movement helps keep back muscles loose. Avoid lifting or twisting.
* **Therapy:** Use ice packs for the first 48 hours to manage inflammation, then switch to dry or moist heat to relax tight muscles.
* **OTC Relief:** Anti-inflammatory medications like ibuprofen or naproxen can help reduce pain and swelling.

**When to seek immediate care:**
Seek urgent medical evaluation if your back pain is accompanied by loss of bowel or bladder control, numbness in the saddle/groin area, sudden weakness in your legs, or if the pain was the result of a significant trauma or fall.`;
  }

  // 9. Generic Fallback
  return `Thank you for sharing your symptoms. To help me give you a more accurate clinical assessment, could you tell me:

* How long have you had these symptoms?
* What is the pain level on a scale of 1 to 10?
* Do you have other symptoms like fever, chills, dizziness, or localized swelling?

*Reminder: If you are experiencing severe pain, difficulty breathing, chest tightness, or have suffered a high-impact injury, please seek professional emergency medical care immediately.*`;
};

// Primary response generator
export const generateAIResponse = async (messages: GroqMessage[]): Promise<string> => {
  const currentKey = getApiKey();
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error response:", errorData);
      
      // If we get an authorization or key error, fallback to local clinical response generator
      if (response.status === 401 || response.status === 403 || response.status === 400) {
        console.warn("Invalid/Expired API Key detected. Falling back to local smart diagnostic responder.");
        return generateLocalFallbackResponse(messages);
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response, using local clinical fallback:", error);
    return generateLocalFallbackResponse(messages);
  }
};

export const getMedicalSystemPrompt = (): string => {
  return `You are a helpful, direct medical assistant that specializes in symptom assessment. 
You MUST conduct the conversation and respond in English.

Your role is to:
1. Provide a direct, helpful preliminary assessment based on the patient's reported symptoms immediately.
2. Provide evidence-based home treatment suggestions for common conditions.
3. Recommend when professional medical care should be sought and what warning signs to watch out for.
4. Be clear, concise, actionable, and compassionate in your responses.

Important guidelines:
- Do NOT interrogate the user with multiple follow-up questions. Provide helpful information and recommendations immediately.
- If you need clarification, ask at most ONE simple follow-up question at the very end of your response.
- Do NOT provide definitive diagnoses, but explain potential common causes.
- Always emphasize when symptoms require emergency care or professional medical evaluation.
- Base your suggestions on established medical guidelines.
- Structure your responses clearly, with recommendations in bullet points.`;
};
