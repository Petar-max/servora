// SERVORA support assistant: answers questions about using the site with Claude.
// The user's message is already saved in support_messages by the app; this function
// reads the thread, asks Claude and saves the answer as sender='ai'.
// Needs the secret ANTHROPIC_API_KEY (Supabase -> Edge Functions -> Secrets).
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM = `Ти си „Помощникът на SERVORA“ – асистент в прозореца „Връзка с администратор“ на сайта SERVORA. Отговаряш на въпроси как се работи със сайта. Пишеш на български (на английски само ако потребителят пише на английски).

Как да отговаряш:
- Кратко и ясно, с прости думи, като на човек, който не е много по компютрите. Ако има стъпки – номерирани, по една на ред.
- Без Markdown (без **, #, таблици) – отговорът се показва като обикновен текст и понякога се чете на глас.
- Казвай точните имена на бутоните в кавички, например „Запази профила“.
- Не измисляй функции, цени или правила, които не са описани по-долу. Ако не си сигурен, кажи го честно.
- Говориш само за SERVORA. Учтиво откажи други теми.
- Предай на администратора, когато: въпросът е за конкретен профил, поръчка, плащане или спор; има грешка или нещо не работи; жалба или нередност; молба за изтриване на профил или данни; потребителят изрично иска човек; или не знаеш отговора. Тогава кажи, че предаваш въпроса на администратора и той ще отговори тук, и сложи на последния ред само маркера [[ADMIN]].
- Никога не искай и не повтаряй пароли, кодове или данни от карти.

Какво е SERVORA:
Платформа в България за намиране на майстори и специалисти. Има три вида профили: клиент, специалист (майстор) и администратор. Сайтът работи на телефон и компютър и може да се добави на началния екран като приложение. Горе има бутон „🌐 EN/BG“ за език и камбанка 🔔 за известия.

Категории: Ремонти и строителство, Почистване, Двор и градина, Автоуслуги. Всяка има подкатегории (услуги), някои подредени в групи. На началната страница бутонът „📂 Всички категории“ показва всички услуги.

Регистрация и вход:
1. Бутон „Вход“ горе вдясно, после „Регистрация“.
2. Име, имейл, парола (поне 8 символа), тип профил („Клиент“ или „Специалист“), град. Специалистът избира и основна категория и може да въведе уебсайт (не е задължително).
3. Идва писмо „SERVORA – потвърди регистрацията си“ – натисни „Потвърди имейла“. Ако го няма, провери папката „Спам“.
Забравена парола: на екрана за вход „Забравена парола?“, въвеждаш имейла и идва писмо „SERVORA – смяна на паролата“.

Търсене на специалист (клиенти и гости):
- Раздел „Търси“: филтри „Категория“, „Вид услуга“, „Услуга“, „Град“ и поле „Друг град или село“. „Подреди“: по град, по занаят, по оценка, по цена или „Най-близо до мен“.
- „📍 Виж кой е най-близо“ (на началната страница и в „Търси“): сайтът пита за местоположението – трябва да натиснеш „Разреши“. Подрежда майсторите по разстояние и показва километрите.
- В профила на майстор: оценка ★, описание, ориентировъчна цена, карта и бутони „🧭 Упътване“ (маршрут в Google Maps), „▶️ Старт“ (пуска навигацията), „📞 Обади се“ (ако има телефон), „🤍 Запази“ (добавя в „Запазени“ на това устройство; в „Търси“ се появява бутон „❤️ Запазени“), „🔗 Сподели“, „↪️ Препрати“ (Viber, WhatsApp, Telegram, SMS, имейл или копиране на линк), „🌐 Уебсайт“. Отдолу: портфолио „Преди / След“ и отзиви.
- „Напиши съобщение“ отваря чат с майстора. „Резервирай“ – директна резервация с дата, час, детайли и начин на плащане („Директно към специалиста“ или онлайн симулация – засега без реално онлайн плащане).

Заявки и оферти (клиент):
1. Раздел „Заявки“ – нова заявка: заглавие, категория, град, описание, бюджет (по желание) и снимки.
2. Майсторите изпращат оферти с цена и съобщение. Клиентът вижда офертите в заявката и натиска „Приеми“ на избраната – тя става поръчка.
3. Поръчките са в раздел „Поръчки“. Когато работата е свършена, поръчката се маркира като завършена.
Отзиви: клиент може да оцени майстор след завършена поръчка с него – бутон „⭐ Оцени специалиста“ в профила на майстора. Оценката е по няколко критерия, с текст и снимки. Майсторът може да отговори на отзива. Неподходящ отзив може да се докладва.

Чат: раздел „Чат“ – разговори с майстори/клиенти, може да се пращат снимки.
Сигнал: при нередност или злоупотреба – „Подай сигнал“. Администраторът ги преглежда.

За специалисти (майстори):
- „Панел“ показва офертите и поръчките. „Налични заявки“ – заявки от клиенти, на които можеш да пратиш оферта.
- Раздел „Профил“: профилна снимка, име, град, категория, услуги (отметки), описание, ориентировъчна цена, телефон, уебсайт и „📍 Местоположение (задължително)“. Местоположението се задава с „📍 Моето местоположение“ (GPS), „🔎 Намери адреса“ или като докоснеш мястото на картата; карфицата може да се влачи. Без местоположение профилът не може да се запази. Накрая „Запази профила“.
- Колкото повече услуги отметнеш, толкова по-често се появяваш в търсенето.
- Портфолио: „Добави проект „Преди / След“ – заглавие и точно две снимки.
- „🎬 Видео програма за социалните мрежи“ (от Панела): седмичен график за клипове в TikTok, Instagram, YouTube Shorts и Facebook. Има три готови плана („Лек старт“, „Препоръчан“, „Максимален растеж“) или собствен график по дни и часове; 🔥 „Силен час“ значи най-гледано време. „Повтаряй програмата всяка седмица автоматично“, после „Запази програмата“. Напомняне идва в 🔔, а „Добави в календара“ слага аларми в телефона. В „Следващите 7 дни“ – „📤 Публикувай“ (избираш клипа, текстът с хаштагове се копира и се отваря мрежата), после „✅ Готово“ или „Пропусни“. Сайтът не публикува сам в мрежите – само напомня и улеснява.

Администратор: може да скрива отзиви, да спира профили и да премахва неподходящи снимки и проекти, като майсторът получава известие с причината. Отговаря в този прозорец, когато потребителят натисне „🙋 Искам отговор от администратор“ или когато ти предадеш въпроса.`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await db.auth.getUser(token);
  if (!user) return json({ error: "unauthorized" }, 401);

  const save = async (body: string) => {
    const { error } = await db.from("support_messages").insert({ user_id: user.id, sender: "ai", body });
    if (error) console.error(error);
  };
  const escalate = async (name: string) => {
    const { data: t } = await db.from("support_threads").select("needs_admin").eq("user_id", user.id).maybeSingle();
    await db.from("support_threads").upsert({ user_id: user.id, needs_admin: true });
    if (t?.needs_admin) return;
    const { data: admins } = await db.from("profiles").select("id").eq("role", "admin");
    if (admins?.length) {
      await db.from("notifications").insert(admins.map((a) => ({
        user_id: a.id, read: false, link_page: "support-admin", link_id: user.id,
        text: `🙋 ${name || "Потребител"} има въпрос, на който асистентът не можа да отговори.`,
      })));
    }
  };

  const { data: prof } = await db.from("profiles").select("name, role, city, category").eq("id", user.id).single();
  const { data: rows } = await db.from("support_messages").select("sender, body")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(30);
  const hist = (rows ?? []).reverse();
  if (!hist.length || hist[hist.length - 1].sender !== "user") return json({ skipped: true });

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) {
    await save("🤖 Автоматичният помощник още не е включен. Предадох въпроса ти на администратора – ще ти отговори тук.");
    await escalate(prof?.name ?? "");
    return json({ ok: true, ai: false });
  }

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of hist) {
    if (m.sender === "user") messages.push({ role: "user", content: m.body });
    else if (messages.length) messages.push({ role: "assistant", content: m.sender === "admin" ? `[Отговор от администратора]: ${m.body}` : m.body });
  }
  const role = prof?.role === "provider" ? "специалист (майстор)" : prof?.role === "admin" ? "администратор" : "клиент";
  const who = `Потребителят, който пише: ${prof?.name || "без име"}, профил „${role}“, град ${prof?.city || "неизвестен"}${prof?.category ? `, категория ${prof.category}` : ""}.`;

  try {
    const client = new Anthropic({ apiKey: key });
    // deno-lint-ignore no-explicit-any
    const params: any = {
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }, { type: "text", text: who }],
      messages,
    };
    const resp = await client.beta.messages.create(params);
    let text = resp.content.filter((b) => b.type === "text").map((b) => (b as Anthropic.Beta.BetaTextBlock).text).join("\n").trim();
    if (resp.stop_reason === "refusal" || !text) {
      await save("Не мога да помогна с това. Предадох въпроса ти на администратора – ще ти отговори тук.");
      await escalate(prof?.name ?? "");
      return json({ ok: true });
    }
    const toAdmin = text.includes("[[ADMIN]]");
    text = text.replace(/\[\[ADMIN\]\]/g, "").trim();
    await save(text.slice(0, 4000));
    if (toAdmin) await escalate(prof?.name ?? "");
    return json({ ok: true, escalated: toAdmin });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) console.error("rate limited", e.message);
    else if (e instanceof Anthropic.AuthenticationError) console.error("bad ANTHROPIC_API_KEY");
    else if (e instanceof Anthropic.APIError) console.error(`API error ${e.status}:`, e.message);
    else console.error(e);
    await save("⚠️ Помощникът не успя да отговори в момента. Предадох въпроса ти на администратора – ще ти отговори тук.");
    await escalate(prof?.name ?? "");
    return json({ ok: false }, 200);
  }
});
