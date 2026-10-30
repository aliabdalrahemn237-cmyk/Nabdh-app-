import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, Pressable, ScrollView, StyleSheet, Switch, StatusBar, Alert } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const C = {
  bg: "#10182F", panel: "#192442", panel2: "#223153", border: "#334568",
  text: "#F5F7FF", muted: "#B7C3DE", mint: "#75E0CC", blue: "#9CB8FF",
  purple: "#C4B5FD", green: "#86EFAC", orange: "#F5C477", pink: "#FDA4AF"
};

const IQ = [
  { type: "منطق", q: "ما الرقم الذي يكمل النمط؟ 3، 6، 9، 12، ؟", options: ["14", "15", "16", "18"], answer: 1, explain: "يزيد كل رقم بمقدار 3، لذا الرقم التالي 15." },
  { type: "استدلال", q: "كل القطط حيوانات. بعض الحيوانات تعيش في الماء. هل يلزم أن بعض القطط تعيش في الماء؟", options: ["نعم، دائماً", "لا، لا يلزم من المعطيات", "كل القطط تعيش في الماء", "لا توجد قطط"], answer: 1, explain: "المعطيات لا تثبت وجود تداخل بين القطط والحيوانات التي تعيش في الماء." },
  { type: "حساب", q: "إذا صنعت 4 آلات 4 قطع في 4 دقائق، فكم دقيقة تحتاج 8 آلات لصنع 8 قطع بالمعدل نفسه؟", options: ["4 دقائق", "8 دقائق", "12 دقيقة", "16 دقيقة"], answer: 0, explain: "كل آلة تصنع قطعة في 4 دقائق؛ 8 آلات تصنع 8 قطع في 4 دقائق." },
  { type: "تركيز", q: "أي كلمة مختلفة عن البقية؟", options: ["تفاح", "موز", "جزر", "عنب"], answer: 2, explain: "الجزر خضار في الاستخدام الشائع، والبقية فواكه." },
  { type: "تسلسل", q: "ما الحرف التالي في هذا النمط؟ أ، ب، ج، د، ؟", options: ["هـ", "و", "ز", "أ"], answer: 0, explain: "الحرف التالي في ترتيب الحروف هو هـ." }
];

const PERSONALITY = [
  { area: "التعاطف والتواصل", q: "عندما يخبرك شخص أنه متضايق، ما الأقرب إلى تصرفك؟", options: ["أحاول فهم شعوره والاستماع له", "أبحث عن حل عملي مباشرة", "أحتاج وقتاً لأعرف كيف أستجيب"] },
  { area: "إدارة الخلاف", q: "عندما تختلف مع شخص، ماذا تفعل غالباً؟", options: ["أستمع وأحاول الوصول إلى حل", "أحتاج وقتاً للهدوء قبل النقاش", "أتمسك برأيي حتى لو تصاعد الخلاف"] },
  { area: "المسؤولية", q: "إذا ارتكبت خطأً أثر في شخص آخر، ماذا تفعل غالباً؟", options: ["أعترف به وأحاول إصلاح أثره", "أشرح الظروف التي أدت إليه", "أجد صعوبة في الاعتراف به"] },
  { area: "اتخاذ القرار", q: "عندما ترغب بشيء قد يضر شخصاً آخر، ما الذي يساعدك على القرار؟", options: ["أوازن بين احتياجات الجميع والعواقب", "أركز أولاً على هدفي ثم أراجع النتائج", "أتصرف بسرعة ثم أفكر فيما حدث"] },
  { area: "احترام الحدود", q: "كيف تتعامل مع حدود يضعها شخص آخر؟", options: ["أحترمها حتى إن لم أتفق معها", "أناقشها باحترام إذا كان هناك سوء فهم", "أضغط عليه غالباً كي يغير رأيه"] }
];

const LAB = [
  { q: "المساعد غير متأكد من معلومة. ما السلوك الأفضل؟", options: ["يخترع إجابة مقنعة", "يوضح عدم اليقين ويتحقق عند الحاجة", "يتجاهل السؤال"], answer: 1, why: "الصدق يقتضي توضيح حدود المعرفة." },
  { q: "المستخدم يفضل الاختصار لكنه يسأل عن موضوع حساس. ماذا يفعل المساعد؟", options: ["يحذف التحذيرات المهمة", "يختصر مع إبقاء المعلومات الأساسية", "يتجاهل تفضيله دائماً"], answer: 1, why: "التخصيص لا ينبغي أن يلغي السلامة." },
  { q: "يمكن تقديم خدمة جيدة دون جمع موقع دقيق. ما الأفضل؟", options: ["جمع كل البيانات", "استخدام الحد الأدنى اللازم", "مشاركة السجل تلقائياً"], answer: 1, why: "تقليل البيانات يحمي الخصوصية." }
];

function Button({ title, onPress, secondary = false, disabled = false }) {
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}
    style={[s.button, secondary && s.buttonSecondary, disabled && { opacity: 0.4 }]}>
    <Text style={[s.buttonText, secondary && { color: C.text }]}>{title}</Text>
  </Pressable>;
}
function Card({ children }) { return <View style={s.card}>{children}</View>; }
function Heading({ children }) { return <Text style={s.heading}>{children}</Text>; }
function Small({ children }) { return <Text style={s.small}>{children}</Text>; }

export default function App() {
  const [tab, setTab] = useState("home");
  const [iqIndex, setIqIndex] = useState(0);
  const [iqAnswers, setIqAnswers] = useState([]);
  const [iqDone, setIqDone] = useState(false);
  const [pIndex, setPIndex] = useState(0);
  const [pAnswers, setPAnswers] = useState([]);
  const [pDone, setPDone] = useState(false);
  const [labAnswers, setLabAnswers] = useState([]);
  const [prefs, setPrefs] = useState({ concise: true, personalization: true });
  const [counts, setCounts] = useState({ explore: 0, iq: 0, personality: 0 });
  const [labMode, setLabMode] = useState("intro");

  const log = key => setCounts(old => ({ ...old, [key]: old[key] + 1 }));
  const score = useMemo(() => iqAnswers.reduce((n, a, i) => n + (a === IQ[i].answer ? 1 : 0), 0), [iqAnswers]);

  function startIQ() { setIqIndex(0); setIqAnswers([]); setIqDone(false); log("iq"); setTab("iq"); }
  function startPersonality() { setPIndex(0); setPAnswers([]); setPDone(false); log("personality"); setTab("personality"); }
  function startLab() { setLabAnswers([]); setLabMode("quiz"); setTab("lab"); }

  function Home() {
    return <ScrollView contentContainerStyle={s.content}>
      <View style={s.topline}><View><Small>مرحباً بك في</Small><Text style={s.brand}>نبض <Text style={{ color: C.mint }}>NABDH</Text></Text></View><Text style={s.cloud}>☁️</Text></View>
      <Card><Text style={s.eyebrow}>تجربتك، بطريقتك</Text><Heading>اكتشف طريقة تفكيرك</Heading><Text style={s.body}>تحديات ذهنية، تأمل في أنماط الشخصية، ومختبر مبادئ الذكاء الاصطناعي.</Text><Button title="ابدأ الاستكشاف ←" onPress={() => { log("explore"); setTab("discover"); }} /></Card>
      <Heading>مساحاتك الذكية</Heading>
      <Pressable onPress={startIQ}><Card><Text style={s.icon}>🧠</Text><Text style={s.cardTitle}>غيمة الذكاء</Text><Text style={s.body}>تحديات منطق وتركيز واستدلال. النتيجة تدريبية وليست درجة IQ معيارية.</Text><Text style={s.link}>ابدأ التحدي ←</Text></Card></Pressable>
      <Pressable onPress={startPersonality}><Card><Text style={s.icon}>🪞</Text><Text style={s.cardTitle}>مرآة الشخصية</Text><Text style={s.body}>تأمل في التواصل والمسؤولية واحترام الحدود، دون تشخيص نفسي أو تصنيف الأشخاص.</Text><Text style={s.link}>استكشف أنماطك ←</Text></Card></Pressable>
      <Pressable onPress={startLab}><Card><Text style={s.icon}>🔬</Text><Text style={s.cardTitle}>مختبر سلوك الذكاء الاصطناعي</Text><Text style={s.body}>سيناريوهات تعليمية عن الدقة والخصوصية والسلامة.</Text><Text style={s.link}>افتح المختبر ←</Text></Card></Pressable>
      <Card><Heading>نشاط هذه الجلسة</Heading><View style={s.statsRow}><Stat value={counts.explore} label="استكشاف"/><Stat value={counts.iq} label="تحديات"/><Stat value={counts.personality} label="تأملات"/></View><Small>عدادات محلية مؤقتة، لا تُرسل إلى خادم.</Small></Card>
    </ScrollView>;
  }

  function Stat({ value, label }) { return <View style={s.stat}><Text style={s.statNum}>{value}</Text><Small>{label}</Small></View>; }

  function Discover() {
    return <ScrollView contentContainerStyle={s.content}><Heading>اكتشف نبض</Heading><Text style={s.body}>اختر المساحة التي تناسبك اليوم.</Text>
      <Card><Text style={s.cardTitle}>🧠 غيمة الذكاء</Text><Text style={s.body}>خمسة أسئلة متنوعة مع شرح الإجابات.</Text><Button title="ابدأ الاختبار" onPress={startIQ}/></Card>
      <Card><Text style={s.cardTitle}>🪞 مرآة الشخصية</Text><Text style={s.body}>أسئلة للتفكير في أسلوبك، وليست أداة تشخيص نفسي.</Text><Button title="ابدأ التأمل" onPress={startPersonality}/></Card>
      <Card><Text style={s.cardTitle}>🔬 مختبر الذكاء الاصطناعي</Text><Text style={s.body}>سيناريوهات لتقييم مبادئ المساعد.</Text><Button title="اختبر السيناريوهات" onPress={startLab}/></Card>
    </ScrollView>;
  }

  function IQScreen() {
    return <ScrollView contentContainerStyle={s.content}><Text style={s.kicker}>☁️ غيمة الذكاء</Text>
      {!iqDone ? <>
        <View style={s.progressLine}><Small>السؤال {iqIndex + 1} من {IQ.length}</Small><Small>{Math.round((iqIndex + 1) / IQ.length * 100)}%</Small></View>
        <View style={s.progressTrack}><View style={[s.progressFill, { width: `${(iqIndex + 1) / IQ.length * 100}%` }]} /></View>
        <Card><Text style={s.eyebrow}>{IQ[iqIndex].type}</Text><Heading>{IQ[iqIndex].q}</Heading>
          {IQ[iqIndex].options.map((opt, i) => <Pressable key={opt} onPress={() => setIqAnswers(old => { const a = [...old]; a[iqIndex] = i; return a; })} style={[s.option, iqAnswers[iqIndex] === i && s.optionSelected]}><Text style={s.body}>{["أ", "ب", "ج", "د"][i]}. {opt}</Text></Pressable>)}
        </Card>
        <View style={s.row}><Button title="السابق" secondary disabled={iqIndex === 0} onPress={() => setIqIndex(i => i - 1)}/><Button title={iqIndex === IQ.length - 1 ? "عرض النتيجة" : "التالي"} disabled={iqAnswers[iqIndex] === undefined} onPress={() => iqIndex < IQ.length - 1 ? setIqIndex(i => i + 1) : setIqDone(true)}/></View>
      </> : <Card><Text style={s.icon}>☁️</Text><Heading>نتيجتك: {score} من {IQ.length}</Heading><Text style={s.body}>هذه نتيجة أداء في تحدٍّ قصير، وليست معدل ذكاء (IQ) معيارياً ولا تشخيصاً لقدراتك.</Text>
        {IQ.map((q, i) => <View key={q.q} style={s.review}><Text style={s.cardTitle}>{iqAnswers[i] === q.answer ? "✓" : "•"} {q.type}: {q.options[q.answer]}</Text><Small>{q.explain}</Small></View>)}
        <Button title="إعادة الاختبار" onPress={() => { setIqIndex(0); setIqAnswers([]); setIqDone(false); }}/><Button title="الرئيسية" secondary onPress={() => setTab("home")}/>
      </Card>}
    </ScrollView>;
  }

  function PersonalityScreen() {
    return <ScrollView contentContainerStyle={s.content}><Text style={s.kicker}>🪞 مرآة الشخصية</Text>
      <Card><Text style={s.body}>أجب وفق ما تفعله غالباً، لا ما تعتقد أنه الإجابة المثالية. هذه أسئلة للتأمل الذاتي فقط؛ لا تكشف السايكوباثية ولا تشخّص اضطراباً نفسياً.</Text></Card>
      {!pDone ? <>
        <View style={s.progressLine}><Small>السؤال {pIndex + 1} من {PERSONALITY.length}</Small></View><View style={s.progressTrack}><View style={[s.progressFill, { width: `${(pIndex + 1) / PERSONALITY.length * 100}%` }]} /></View>
        <Card><Text style={s.eyebrow}>{PERSONALITY[pIndex].area}</Text><Heading>{PERSONALITY[pIndex].q}</Heading>
          {PERSONALITY[pIndex].options.map((opt, i) => <Pressable key={opt} onPress={() => setPAnswers(old => { const a = [...old]; a[pIndex] = i; return a; })} style={[s.option, pAnswers[pIndex] === i && s.optionSelected]}><Text style={s.body}>{opt}</Text></Pressable>)}
        </Card>
        <View style={s.row}><Button title="السابق" secondary disabled={pIndex === 0} onPress={() => setPIndex(i => i - 1)}/><Button title={pIndex === PERSONALITY.length - 1 ? "عرض الملخص" : "التالي"} disabled={pAnswers[pIndex] === undefined} onPress={() => pIndex < PERSONALITY.length - 1 ? setPIndex(i => i + 1) : setPDone(true)}/></View>
      </> : <Card><Heading>ملخص إجاباتك</Heading><Text style={s.body}>هذه اختياراتك للتأمل الذاتي. لا توجد درجة تشخيصية، ولا يمكن استنتاج أن شخصاً سايكوباث من هذه الإجابات.</Text>
        {PERSONALITY.map((q, i) => <View key={q.area} style={s.review}><Text style={s.cardTitle}>{q.area}</Text><Small>{q.options[pAnswers[i]]}</Small></View>)}
        <Button title="إعادة التأمل" onPress={() => { setPIndex(0); setPAnswers([]); setPDone(false); }}/><Button title="الرئيسية" secondary onPress={() => setTab("home")}/>
      </Card>}
    </ScrollView>;
  }

  function LabScreen() {
    return <ScrollView contentContainerStyle={s.content}><Text style={s.kicker}>🔬 مختبر السلوك الذكي</Text>
      <Card><Heading>اختبر قرارات المساعد</Heading><Text style={s.body}>سيناريوهات ثابتة عن الدقة والخصوصية والسلامة. هذه نسخة تعليمية، وليست اختباراً لنموذج ذكاء اصطناعي متصل.</Text></Card>
      {LAB.map((item, i) => <Card key={item.q}><Text style={s.eyebrow}>السيناريو {i + 1}</Text><Text style={s.cardTitle}>{item.q}</Text>
        {item.options.map((opt, j) => <Pressable key={opt} onPress={() => setLabAnswers(old => { const a = [...old]; a[i] = j; return a; })} style={[s.option, labAnswers[i] === j && s.optionSelected]}><Text style={s.body}>{opt}</Text></Pressable>)}
        {labAnswers[i] !== undefined && <Small>{labAnswers[i] === item.answer ? "✓ اختيار متوافق. " : "الإجابة الأنسب: " + item.options[item.answer] + ". "}{item.why}</Small>}
      </Card>)}
      <Button title="إعادة السيناريوهات" secondary onPress={() => setLabAnswers([])}/><Button title="الرئيسية" onPress={() => setTab("home")}/>
    </ScrollView>;
  }

  function Settings() {
    return <ScrollView contentContainerStyle={s.content}><Heading>التفضيلات والخصوصية</Heading>
      <Card><View style={s.switchRow}><View style={{ flex: 1 }}><Text style={s.cardTitle}>إجابات مختصرة</Text><Small>تفضيل للواجهة في هذه النسخة.</Small></View><Switch value={prefs.concise} onValueChange={v => setPrefs(p => ({ ...p, concise: v }))} trackColor={{ true: C.mint }}/></View>
        <View style={s.switchRow}><View style={{ flex: 1 }}><Text style={s.cardTitle}>التخصيص المحلي</Text><Small>استخدام عدادات الجلسة لعرض اقتراح توضيحي.</Small></View><Switch value={prefs.personalization} onValueChange={v => setPrefs(p => ({ ...p, personalization: v }))} trackColor={{ true: C.mint }}/></View>
        <Text style={s.body}>{prefs.personalization ? "اقتراح تجريبي: " + (counts.iq > counts.personality ? "قد ترغب في تحدٍّ عقلي آخر." : "قد ترغب في استكشاف مرآة الشخصية أو المختبر.") : "التخصيص معطل."}</Text>
        <Button title="مسح عدادات الجلسة" secondary onPress={() => setCounts({ explore: 0, iq: 0, personality: 0 })}/>
      </Card>
      <Card><Heading>حول النسخة</Heading><Text style={s.body}>نبض نموذج أولي يعمل محلياً. لا يحتوي على تسجيل دخول أو خادم أو نموذج ذكاء اصطناعي خارجي. اختبارات الذكاء والشخصية تعليمية وليست أدوات تشخيص.</Text></Card>
    </ScrollView>;
  }

  const screens = { home: <Home/>, discover: <Discover/>, iq: <IQScreen/>, personality: <PersonalityScreen/>, lab: <LabScreen/>, settings: <Settings/> };
  const nav = [
    ["home", "الرئيسية", "⌂"], ["discover", "استكشف", "⌕"], ["iq", "غيمة الذكاء", "☁"], ["personality", "الشخصية", "◉"], ["settings", "الإعدادات", "⚙"]
  ];

  return <SafeAreaView style={s.safe}><StatusBar barStyle="light-content" backgroundColor={C.bg}/><ExpoStatusBar style="light"/>
    <View style={s.app}>{screens[tab] || screens.home}
      <View style={s.nav}>{nav.map(([key, label, icon]) => <Pressable key={key} onPress={() => setTab(key)} style={s.navItem}><Text style={[s.navIcon, tab === key && { color: C.mint }]}>{icon}</Text><Text numberOfLines={1} style={[s.navText, tab === key && { color: C.mint }]}>{label}</Text></Pressable>)}
        <Pressable onPress={() => setTab("lab")} style={s.navItem}><Text style={[s.navIcon, tab === "lab" && { color: C.mint }]}>⚗</Text><Text style={[s.navText, tab === "lab" && { color: C.mint }]}>المختبر</Text></Pressable>
      </View>
    </View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  app: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, paddingBottom: 28, gap: 14 },
  topline: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  brand: { color: C.text, fontSize: 28, fontWeight: "800", textAlign: "right" },
  cloud: { fontSize: 38 },
  card: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 16, gap: 11 },
  heading: { color: C.text, fontSize: 21, fontWeight: "800", textAlign: "right", lineHeight: 31 },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: "700", textAlign: "right", lineHeight: 24 },
  body: { color: C.muted, fontSize: 14, lineHeight: 23, textAlign: "right" },
  small: { color: C.muted, fontSize: 11, lineHeight: 18, textAlign: "right" },
  eyebrow: { color: C.mint, fontSize: 12, fontWeight: "700", textAlign: "right" },
  kicker: { color: C.mint, fontSize: 17, fontWeight: "800", textAlign: "right", marginBottom: 3 },
  icon: { fontSize: 26, textAlign: "right" },
  link: { color: C.mint, fontSize: 14, fontWeight: "700", textAlign: "right" },
  button: { backgroundColor: C.mint, borderRadius: 13, paddingVertical: 13, paddingHorizontal: 15, alignItems: "center", justifyContent: "center", flex: 1, minHeight: 46 },
  buttonSecondary: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border },
  buttonText: { color: "#102036", fontWeight: "800", fontSize: 14 },
  row: { flexDirection: "row-reverse", gap: 10 },
  option: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, marginTop: 7 },
  optionSelected: { borderColor: C.mint, backgroundColor: "#29445A" },
  progressLine: { flexDirection: "row-reverse", justifyContent: "space-between" },
  progressTrack: { height: 6, backgroundColor: C.panel2, borderRadius: 8, overflow: "hidden" },
  progressFill: { height: 6, backgroundColor: C.mint, borderRadius: 8 },
  review: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, gap: 4 },
  statsRow: { flexDirection: "row-reverse", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 4 },
  statNum: { color: C.mint, fontSize: 22, fontWeight: "800" },
  switchRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, paddingVertical: 8 }
});
