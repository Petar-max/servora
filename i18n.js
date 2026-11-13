// SERVORA: language switch (BG/EN) and word suggestions while typing.
// The app is written in Bulgarian. In English mode every rendered UI text is
// translated after render (MutationObserver). User content (titles, descriptions,
// messages, names) stays as it was written. Form values stay in Bulgarian, so
// the database always gets the same values.
'use strict';
let LANG = (() => { try { return localStorage.getItem('servora-lang') === 'en' ? 'en' : 'bg' } catch { return 'bg' } })();
const LOCALE = () => LANG === 'en' ? 'en-GB' : 'bg-BG';

const I18N = {
  // navigation and general
  'Начало':'Home','Търси':'Search','Заявки':'Requests','Чат':'Chat','Профил':'Profile','Панел':'Dashboard','Админ':'Admin',
  'Поръчки':'Orders','Вход':'Log in','Регистрация':'Sign up','Изход':'Log out','Известия':'Notifications','Назад':'Back',
  'Разговори':'Conversations','Специалисти':'Professionals','Специалист':'Professional','Клиент':'Customer','Администратор':'Administrator',
  'Зареждане…':'Loading…','Екранът не е намерен.':'Screen not found.','Екранът не е намерен':'Screen not found','Подай сигнал':'Report a problem',
  'Цяла България':'All of Bulgaria','Добрата работа започва с правилния човек.':'Good work starts with the right person.',
  'Добрата работа започва с правилния човек':'Good work starts with the right person',
  'Намери специалист, сравни оферти или резервирай директно.':'Find a professional, compare offers or book directly.',
  'Намери специалист, сравни оферти или резервирай директно':'Find a professional, compare offers or book directly',
  'Намери специалист':'Find a professional','Публикувай заявка':'Post a request','Какво ти трябва?':'What do you need?','Какво ти трябва':'What do you need',
  'Виж всички':'See all','Всички':'All','Всички категории':'All categories','Всички градове и села':'All towns and villages',
  'Категория':'Category','Основна категория':'Main category','Град':'Town','Град или село…':'Town or village…',
  'Няма такова населено място':'No such place','Избери населено място от списъка':'Choose a place from the list',
  'Все още няма специалисти по тези критерии.':'No professionals match these filters yet.','Все още няма специалисти по тези критерии':'No professionals match these filters yet',
  '✓ Проверен (демо)':'✓ Verified (demo)','Проверен (демо)':'Verified (demo)','Проверен':'Verified','Непроверен':'Not verified','демо':'demo',
  // categories and services
  'Ремонти и строителство':'Repairs & construction','Почистване':'Cleaning','Двор и градина':'Yard & garden','Автоуслуги':'Car services',
  'Категории':'Categories','Услуга':'Service','Избери от какво имаш нужда и виж специалистите за него.':'Choose what you need and see the professionals for it.',
  'Какво работиш?':'What do you do?','(избери едно или повече)':'(choose one or more)','За тази категория няма подкатегории.':'This category has no subcategories.',
  'Бани':'Bathrooms','Боядисване':'Painting','ВиК':'Plumbing','Електро':'Electrical','До ключ':'Turnkey','Покриви':'Roofs','Мебели':'Furniture',
  'Отопление и газ':'Heating & gas','Подови настилки':'Flooring','Дограма и щори':'Windows & blinds','Врати и ключари':'Doors & locksmiths',
  'Дърводелство':'Carpentry','Гипсокартон и тавани':'Drywall & ceilings','Зидария и строеж':'Masonry & building','Изолация и фасади':'Insulation & facades',
  'Климатици':'Air conditioning','Соларни системи':'Solar systems','Метал и заварки':'Metal & welding','Градини и дворове':'Gardens & yards',
  'Битова техника':'Appliances','Камери и домофони':'Cameras & intercoms','Архитект и дизайн':'Architect & design',
  'Вид услуга':'Service type','Всички в групата':'All in this group',
  'Гуми и ходова част':'Tyres & running gear','Двигател и механика':'Engine & mechanics','Електрика и диагностика':'Electrics & diagnostics','Купе и боя':'Body & paint',
  'Почистване и интериор':'Cleaning & interior','Газови уредби и специални системи':'LPG & special systems','Прегледи и документи':'Inspections & documents',
  'Пътна помощ и транспорт':'Roadside help & transport','Други превозни средства':'Other vehicles',
  'Вулканизатор (смяна и ремонт на гуми)':'Tyre shop (change & repair)','Баланс на гуми':'Wheel balancing','Геометрия (реглаж) на колелата':'Wheel alignment',
  'Сезонно съхранение на гуми (хотел за гуми)':'Seasonal tyre storage','Ремонт и изправяне на джанти':'Rim repair & straightening','Ремонт на окачване и ходова част':'Suspension repair',
  'Смяна на амортисьори':'Shock absorber replacement','Ремонт на спирачна система':'Brake repair','Автомеханик (общ ремонт)':'Car mechanic (general)',
  'Ремонт на двигатели':'Engine repair','Смяна на масло и филтри':'Oil & filter change','Ремонт на скоростни кутии (ръчни)':'Manual gearbox repair',
  'Ремонт на автоматични скоростни кутии':'Automatic gearbox repair','Ремонт на съединител':'Clutch repair','Ремонт на ангренаж (ремъци и вериги)':'Timing belt & chain repair',
  'Ремонт на турбокомпресори':'Turbocharger repair','Ремонт на горивна система и дюзи':'Fuel system & injector repair','Ремонт на дизелови помпи':'Diesel pump repair',
  'Ремонт на ауспуси (гърнета, DPF, катализатори)':'Exhaust repair (DPF, catalysts)','Ремонт на охладителна система и радиатори':'Cooling system & radiator repair',
  'Компютърна диагностика':'Computer diagnostics','Автоелектрик':'Auto electrician','Ремонт на стартери и алтернатори':'Starter & alternator repair',
  'Акумулатори (продажба и смяна)':'Batteries (sale & replacement)','Автоклиматици (зареждане и ремонт)':'Car A/C (recharge & repair)','Монтаж на аудио, навигация и камери':'Audio, navigation & camera fitting',
  'Монтаж на аларми и GPS тракери':'Alarm & GPS tracker fitting','Чип тунинг и софтуер (ECU)':'Chip tuning & ECU software','Ремонт на табла и електроника':'Dashboard & electronics repair',
  'Автотенекеджия':'Panel beater','Автобояджия':'Car painter','Изправяне на вдлъбнатини без боядисване (PDR)':'Paintless dent repair (PDR)',
  'Полиране и защитни покрития (керамика, восък)':'Polishing & protective coatings','Фолиране на автомобили (цветно и защитно PPF)':'Car wrapping (colour & PPF)','Затъмняване на стъкла':'Window tinting',
  'Смяна и ремонт на автостъкла':'Windscreen replacement & repair','Ремонт и реставрация на фарове':'Headlight repair & restoration','Автомивка':'Car wash',
  'Детайлно почистване (детайлинг)':'Detailing','Пране на салон':'Interior shampooing','Автотапицер':'Car upholsterer','Ремонт на кожени седалки и волани':'Leather seat & steering wheel repair',
  'Монтаж и ремонт на газови уредби (АГУ/метан)':'LPG/CNG system fitting & repair','Монтаж на теглич':'Tow bar fitting','Преустройство на автомобили':'Vehicle conversion',
  'Годишен технически преглед (ГТП)':'Annual technical inspection','Подготовка за технически преглед':'Inspection preparation','Регистрация и документи за автомобили':'Car registration & documents',
  'Пътна помощ (репатрак)':'Roadside assistance (tow truck)','Аварийно палене и смяна на гума на място':'Jump start & on-site tyre change','Аварийно отключване на автомобили':'Emergency car unlocking',
  'Изработка на автоключове':'Car key cutting','Ремонт на мотоциклети и скутери':'Motorcycle & scooter repair','Ремонт на камиони и бусове':'Truck & van repair',
  'Ремонт на кемпери и каравани':'Camper & caravan repair','Ремонт на селскостопанска техника':'Farm machinery repair','Ремонт на електромобили и хибриди':'EV & hybrid repair',
  'Ремонт на тротинетки и велосипеди':'E-scooter & bicycle repair',
  'Проектиране и изграждане':'Design & construction','Трева и растения':'Lawn & plants','Дървета':'Trees','Поливане и вода':'Irrigation & water',
  'Настилки и алеи':'Paving & paths','Огради и порти':'Fences & gates','Дворни постройки':'Garden structures','Осветление и техника':'Lighting & equipment',
  'Поддръжка и почистване':'Maintenance & cleaning','Специални':'Special',
  'Ландшафтен дизайн и проектиране на градини':'Landscape & garden design','Озеленяване на дворове':'Yard landscaping','Вертикална планировка (подравняване на терен)':'Land grading',
  'Изкопни работи и подготовка на терен':'Excavation & site preparation','Подпорни стени и укрепване на склонове':'Retaining walls & slope support','Дренажни системи':'Drainage systems',
  'Изграждане на скални кътове и алпинеуми':'Rock gardens','Затревяване (сеене на трева)':'Lawn seeding','Полагане на тревен чим':'Turf laying','Косене на трева':'Lawn mowing',
  'Аериране и скарификация на тревни площи':'Lawn aeration & scarifying','Засаждане на дървета и храсти':'Planting trees & shrubs','Засаждане на цветни лехи':'Flower bed planting',
  'Изграждане на жив плет':'Hedge planting','Торене и пръскане срещу вредители':'Fertilising & pest spraying','Вертикални (зелени) стени':'Green walls',
  'Резитба на овощни дървета':'Fruit tree pruning','Оформяне на декоративни храсти и дървета':'Shaping ornamental shrubs & trees','Рязане и премахване на дървета':'Tree cutting & removal',
  'Алпийско рязане на високи дървета':'Rope access tree cutting','Фрезоване на пънове':'Stump grinding','Лечение и грижа за дървета (арборист)':'Tree care (arborist)',
  'Автоматични поливни системи':'Automatic irrigation','Капково напояване':'Drip irrigation','Сондажи и кладенци':'Boreholes & wells','Помпи и хидрофори':'Pumps & pressure systems',
  'Изграждане на градински езера и водопади':'Garden ponds & waterfalls','Изграждане и поддръжка на басейни':'Pool building & maintenance','Почистване на басейни':'Pool cleaning',
  'Полагане на павета':'Paving stones','Полагане на плочи и бордюри':'Slabs & kerbs','Алеи от камък и чакъл':'Stone & gravel paths','Бетониране на дворове и площадки':'Concrete yards & pads',
  'Асфалтиране на дворове и алеи':'Asphalt yards & driveways','Гумени настилки (детски и спортни площадки)':'Rubber surfaces (play & sports areas)',
  'Изграждане на огради (метални, дървени, бетонни)':'Fence building (metal, wood, concrete)','Плетени огради и мрежи':'Mesh & woven fences','Порти и плъзгащи врати':'Gates & sliding gates',
  'Автоматика за порти и бариери':'Gate & barrier automation','Ремонт на огради':'Fence repair','Беседки и навеси':'Gazebos & shelters','Перголи':'Pergolas',
  'Дървени къщички и бараки за инструменти':'Garden sheds','Барбекюта и летни кухни':'BBQs & outdoor kitchens','Тераси и дървени декинги':'Terraces & decking','Зимни градини':'Conservatories',
  'Навеси за коли (карпорт)':'Carports','Градинско осветление':'Garden lighting','Видеонаблюдение за двор':'Yard CCTV','Ремонт на градинска техника (косачки, тримери, моторни триони)':'Garden equipment repair',
  'Абонаментна поддръжка на градини':'Garden maintenance plans','Почистване на дворове и парцели':'Yard & plot clearing','Извозване на градински отпадъци':'Garden waste removal',
  'Почистване от сняг':'Snow clearing','Почистване на олуци':'Gutter cleaning','Дезинсекция и дератизация в двора':'Yard pest control','Есенно и пролетно почистване на градини':'Seasonal garden clean-up',
  'Детски площадки в двора':'Backyard playgrounds','Спортни игрища (футбол, тенис)':'Sports courts (football, tennis)','Изкуствена трева':'Artificial grass',
  'Отглеждане на зеленчукови градини':'Vegetable gardens','Оранжерии и парници':'Greenhouses','Монтаж на компостери':'Compost bin installation',
  'боядисване':'painting','боядисване на стени':'wall painting','шпакловка':'plastering','поставяне на плочки':'tiling','ремонт на баня':'bathroom renovation',
  'електроинсталация':'electrical wiring','смяна на контакти':'replacing sockets','монтаж на гипсокартон':'drywall installation','ремонт на покрив':'roof repair',
  'поставяне на ламинат':'laminate flooring','почистване на апартамент':'apartment cleaning','почистване след ремонт':'post-renovation cleaning',
  'пране на диван':'sofa cleaning','миене на прозорци':'window cleaning','основно почистване':'deep cleaning','почистване на офис':'office cleaning',
  'косене на трева':'lawn mowing','подрязване на дървета':'tree pruning','озеленяване':'landscaping','изграждане на поливна система':'irrigation system',
  'почистване на двор':'yard cleanup','смяна на масло':'oil change','смяна на накладки':'brake pad replacement','автодиагностика':'car diagnostics',
  'полиране на автомобил':'car polishing','ремонт на спирачки':'brake repair','почистване на автомобил':'car cleaning',
  // auth
  'Добре дошъл':'Welcome','Твоят профил в SERVORA':'Your SERVORA profile','Тествай отделни клиентски и майсторски профили.':'Try separate customer and professional profiles.',
  'Тествай отделни клиентски и майсторски профили':'Try separate customer and professional profiles',
  'Име':'Name','Имейл':'Email','Парола':'Password','Парола (поне 8 символа)':'Password (at least 8 characters)','поне 8 символа':'at least 8 characters',
  'Тип профил':'Profile type','Търся специалист и публикувам заявки':'I look for professionals and post requests','Предлагам услуги и пращам оферти':'I offer services and send quotes',
  'Създай профил':'Create profile','Демо профили':'Demo profiles','Парола за всички':'Password for all',
  'Профилите се пазят в Supabase. Демо профилите са общи за всички тестващи, затова не въвеждай лични данни в тях.':'Profiles are stored in Supabase. Demo profiles are shared by all testers, so do not enter personal data in them.',
  'Влез или се регистрирай':'Log in or sign up','Успешен вход':'Logged in','Профилът е създаден':'Profile created','Невалиден имейл или парола':'Wrong email or password',
  'Невалиден имейл адрес':'Invalid email address','Този имейл вече е регистриран':'This email is already registered','Паролата трябва да е поне 8 символа':'Password must be at least 8 characters',
  'Потвърди имейла си от писмото, което получи':'Confirm your email using the message we sent you','Изпратихме ти имейл за потвърждение. Потвърди го и влез.':'We sent you a confirmation email. Confirm it, then log in.',
  'Не можем да изпратим писмо до този имейл':'We cannot send email to this address','Твърде много опити. Опитай след малко.':'Too many attempts. Try again in a moment.',
  'Няма връзка със сървъра':'Cannot reach the server','Грешка':'Error',
  // requests
  'Нова заявка':'New request','Опиши задачата и добави снимки, за да получиш по-точни оферти.':'Describe the job and add photos to get more accurate quotes.',
  'Заглавие':'Title','Напр. ремонт на баня':'E.g. bathroom renovation','Описание':'Description','Започни да пишеш, например: бояд...':'Start typing, e.g. paint...',
  'Бюджет (€)':'Budget (€)','Бюджет':'Budget','По желание':'Optional','По договаряне':'Negotiable','Снимки (до 5)':'Photos (up to 5)','Снимки':'Photos',
  'Заявката е публикувана':'Request posted','Заявката е отменена':'Request cancelled','Да отменя ли заявката?':'Cancel this request?','Отмени заявка':'Cancel request',
  'Само клиент може да публикува заявка':'Only customers can post requests','Моите заявки':'My requests','Налични заявки':'Available requests','Няма заявки за показване.':'No requests to show.',
  'Заявката вече не е достъпна':'This request is no longer available','Отворена':'Open','Нова':'New','Приета':'Accepted','Отказана':'Declined','Отменена':'Cancelled','Завършена':'Completed','Чака':'Pending',
  'Обработват се снимките…':'Processing photos…','Няма добавени снимки':'No photos added','Снимка':'Photo','📷 Снимка':'📷 Photo',
  // offers / orders
  'Оферти':'Offers','Изпрати оферта':'Send a quote','Цена (€)':'Price (€)','Цена':'Price','Съобщение':'Message','Изпрати':'Send','Приеми оферта':'Accept offer',
  'Офертата е изпратена':'Quote sent','Офертата е приета':'Offer accepted','Изпратени оферти':'Sent quotes','Оферти по твоите заявки':'Offers on your requests',
  'Директна резервация':'Direct booking','Резервирай':'Book','Дата':'Date','Час':'Time','Начин на плащане':'Payment method','Директно към специалиста':'Pay the professional directly',
  'Онлайн — симулация, без реално плащане':'Online — simulation, no real payment','Онлайн — симулация (без реално плащане)':'Online — simulation (no real payment)','Онлайн (демо)':'Online (demo)','Директно плащане':'Direct payment','За кого/какво':'Details',
  'Часовете са демонстрационни. Няма реална проверка на календар или плащане.':'Time slots are a demo. There is no real calendar or payment check.',
  'Резервацията е записана':'Booking saved','Резервацията е само за клиент':'Only customers can book','Маркирай завършена':'Mark as completed','Поръчката е завършена':'Order completed',
  'Все още няма поръчки.':'No orders yet.','Клиент':'Customer',
  // chat
  'Съобщения':'Messages','Напиши съобщение':'Write a message','Напиши съобщение...':'Write a message...','Съобщенията пристигат на живо.':'Messages arrive live.',
  'Започни разговора.':'Start the conversation.','Снимки в чата (до 3)':'Chat photos (up to 3)','Още няма съобщения':'No messages yet',
  'Нямаш разговори. Отвори профил на специалист и изпрати съобщение.':'No conversations yet. Open a professional’s profile and send a message.',
  'Не можеш да пишеш на себе си':'You cannot message yourself','Чатът е само между клиент и специалист':'Chat is only between a customer and a professional','Напиши съобщение или добави снимка':'Write a message or add a photo',
  // profile / portfolio
  'Моят профил':'My profile','Моят профил и портфолио':'My profile & portfolio','Профилна снимка':'Profile photo','Качи или смени снимката':'Upload or change photo',
  'Премахни снимката':'Remove photo','JPG, PNG или HEIC (ако браузърът поддържа), до 40 MB.':'JPG, PNG or HEIC (if your browser supports it), up to 40 MB.',
  'Описание на услугите':'About your services','Ориентировъчна цена (€)':'Approximate price (€)','Ориентировъчна цена':'Approximate price','Запази профила':'Save profile',
  'Профилът е запазен':'Profile saved','Профилната снимка е обновена':'Profile photo updated','Снимката е премахната':'Photo removed','Избери файл със снимка':'Choose an image file',
  'Снимката трябва да е до 40 MB':'The photo must be up to 40 MB','Добави проект „Преди / След“':'Add a “Before / After” project','Портфолио „Преди / След“':'“Before / After” portfolio',
  'Избери точно две снимки':'Choose exactly two photos','Избери две снимки: преди и след':'Choose two photos: before and after','Добави проект':'Add project','Проектът е добавен':'Project added',
  'Няма добавени проекти.':'No projects yet.','Преди':'Before','След':'After','Все още няма описание.':'No description yet.','Напиши съобщение':'Write a message',
  'Тестова версия. Всички профили и данни са само в този браузър.':'Test version.','Език':'Language','Всички градове':'All towns','Друг град или село':'Another town or village','Изчисти филтрите':'Clear filters','Излязохте от профила':'You are logged out','Тестов режим: можеш да оцениш и без приключена поръчка.':'Test mode: you can rate without a completed order.','Влез като клиент, за да оставиш отзив.':'Log in as a customer to leave a review.',
  'Отзивът ти е по-долу. Нов отзив може след следваща приключена поръчка.':'Your review is below. You can leave a new one after your next completed order.',
  'Отзив може да остави само клиент с приключена поръчка при този специалист. Така всички отзиви са от истински клиенти.':'Only customers with a completed order from this professional can leave a review, so every review comes from a real customer.',
  'Докосни звездичките за всяка категория, от 1 до 5. Общата оценка е средната от тях.':'Tap the stars for each category, from 1 to 5. The overall score is their average.','Подреди':'Sort','По град':'By town','По занаят':'By trade','По оценка':'By rating','По цена':'By price','специалист':'professional','специалисти':'professionals','Тестова версия.':'Test version.',
  // dashboard
  'Панел на специалиста':'Professional dashboard','Управлявай заявките, офертите и разговорите.':'Manage requests, quotes and conversations.',
  // reviews
  'Остави отзив':'Leave a review','Отзив':'Review','Отзиви':'Reviews','Отзиви от клиенти':'Customer reviews','Все още няма отзиви.':'No reviews yet.','Няма отзиви със снимки.':'No reviews with photos.',
  'Дай от 1 до 5 звезди за всяка категория. Общата оценка е средната от тях.':'Give 1 to 5 stars in each category. The overall score is their average.',
  'Качество на работата':'Quality of work','Точност и срок':'Punctuality & timing','Чистота след работа':'Cleanliness after work','Комуникация':'Communication','Цена / качество':'Value for money',
  'Как мина работата? Какво ти хареса?':'How did the job go? What did you like?','Снимки на готовата работа (до 5)':'Photos of the finished work (up to 5)','Публикувай отзива':'Publish review',
  'Оцени всички категории':'Rate every category','Отзивът е публикуван':'Review published','Снимки от клиенти':'Photos from customers','Със снимки':'With photos',
  'Отговори':'Reply','Благодаря за отзива…':'Thanks for the review…','Публикувай отговора':'Publish reply','Отговорът е публикуван':'Reply published',
  'Докладвай':'Report','Какъв е проблемът?':'What is the problem?','Изпрати сигнал':'Send report','Сигналът е изпратен':'Report sent','Скрий отзива':'Hide review','Покажи отново':'Show again',
  'Отзивът е скрит':'Review hidden','Отзивът е видим отново':'Review visible again','Скрит от администратор':'Hidden by an administrator','Към профила':'Go to profile','Причина':'Reason',
  'Няма':'None',
  // notifications
  'Няма известия.':'No notifications.','Виж офертите':'See offers','Виж заявката':'See request','Виж поръчките':'See orders','Виж отзивите':'See reviews','Отвори чата':'Open chat',
  'Нова директна резервация':'New direct booking','Получен е нов отзив':'You received a new review',
  // admin / reports
  'Потребители':'Users','Сигнали':'Reports','Профили':'Profiles','Няма сигнали.':'No reports.','Натисни върху карта, за да видиш списъка.':'Tap a card to see the list.','✕ Затвори':'✕ Close','Търси по име, имейл, град…':'Search by name, email, city…','Клиенти':'Customers','Специалисти':'Professionals','Администратори':'Admins','Отворени':'Open','Приети':'Accepted','Завършени':'Completed','Отменени':'Cancelled','Активни':'Active','Отвори заявката':'Open request','Заявката':'Request','Специалистът':'Professional','Към профила':'View profile','Няма резултати.':'No results.','Заявката е подадена от':'Request submitted by','Сигнал срещу':'Report against','🔑 Забравена парола?':'🔑 Forgot password?','Забравена парола?':'Forgot password?','Грешен имейл или парола.':'Wrong email or password.','Забравил си паролата? Ще ти изпратим код на пощата, за да си я смениш.':'Forgot your password? We will email you a code so you can change it.','🔑 Смени паролата с код':'🔑 Reset password with a code','Имаш профил?':'Have an account?','🔑 Забравена парола':'🔑 Forgot password','Въведи имейла, с който си се регистрирал. Ще ти изпратим писмо с линк, с който да си смениш паролата.':'Enter the email you registered with. We will send you a link to reset your password.','Изпрати линк за смяна':'Send reset link','📧 Провери пощата си':'📧 Check your email','Отвори писмото от SERVORA (Supabase Auth).':'Open the email from SERVORA (Supabase Auth).','Ще се отвори сайтът, където въвеждаш новата си парола.':'The site opens and you enter your new password.','Не го виждаш? Провери папка „Спам“. Линкът важи 1 час.':'Can\'t find it? Check your spam folder. The link is valid for 1 hour.','Изпрати писмото отново':'Resend email','Писмото е изпратено. Провери пощата си.':'Email sent. Check your inbox.','Изпратихме ново писмо':'We sent a new email','Изчакай минута преди да поискаш ново писмо':'Wait a minute before requesting another email','Линкът е изтекъл или вече е използван. Поискай нов.':'The link has expired or was already used. Request a new one.','Въведи имейла, с който си се регистрирал. Ще ти изпратим код, с който да си смениш паролата.':'Enter the email you registered with. We will send you a code to reset your password.','Изпрати код':'Send code','🔑 Въведи кода':'🔑 Enter the code','Въведи кода по-долу или просто натисни линка в писмото. Провери и папка „Спам“. Кодът важи 1 час.':'Enter the code below or just tap the link in the email. Check your spam folder too. The code is valid for 1 hour.','Код от писмото':'Code from the email','Нова парола (поне 8 символа)':'New password (at least 8 characters)','Повтори новата парола':'Repeat the new password','Смени паролата':'Change password','Изпрати кода отново':'Resend code','Друг имейл':'Different email','🔑 Нова парола':'🔑 New password','Въведи новата си парола.':'Enter your new password.','Запази паролата':'Save password','← Вход':'← Sign in','Кодът е изпратен на пощата ти':'The code was sent to your email','Изпратихме нов код':'We sent a new code','Двете пароли не съвпадат':'The passwords do not match','Кодът е грешен или е изтекъл':'The code is wrong or has expired','Изчакай минута преди да поискаш нов код':'Wait a minute before requesting a new code','Паролата е сменена. Влязохте успешно.':'Password changed. You are signed in.','⛔ Спрени':'⛔ Suspended','⛔ Спрян':'⛔ Suspended','⛔ Блокиран':'⛔ Blocked','⛔ Спри временно или блокирай':'⛔ Suspend or block','Срок':'Duration','1 ден':'1 day','3 дни':'3 days','7 дни':'7 days','30 дни':'30 days','Безсрочно (блокиране)':'Permanent (block)','Причина (потребителят ще я види)':'Reason (shown to the user)','напр. нарушени правила, сигнали от клиенти…':'e.g. broken rules, customer reports…','Потвърди':'Confirm','✔ Възстанови профила':'✔ Restore account','Профилът е скрит от търсенето за клиентите.':'This profile is hidden from customer search.','Профилът ти е блокиран':'Your account is blocked','Профилът ти е временно спрян':'Your account is temporarily suspended','Докато профилът е спрян, не можеш да пускаш заявки, оферти, съобщения, резервации или отзиви. Ако смяташ, че е грешка, свържи се с администратора.':'While your account is suspended you cannot post requests, offers, messages, bookings or reviews. If you think this is a mistake, contact the administrator.','Профилът ти е спрян от администратор.':'Your account has been suspended by an administrator.','Този профил е временно спрян.':'This account is temporarily suspended.','Профилът е блокиран':'Account blocked','Профилът е спрян':'Account suspended','Профилът е възстановен':'Account restored','Няма подадени сигнали срещу този специалист.':'No reports against this professional.','⚑ Подай сигнал срещу този специалист':'⚑ Report this professional','Сигнал може да подаде само клиент, който се е свързал с този специалист — чрез чат, оферта или поръчка.':'Only a customer who has contacted this professional (chat, offer or order) can file a report.','Скрит от администратор':'Hidden by admin','Отговори на сигнала':'Reply to report','Промени отговора':'Edit reply','Публикувай отговора':'Publish reply','Твоят отговор ще се вижда под сигнала':'Your reply will be shown under the report','Скрий сигнала':'Hide report','Скрий от профила':'Hide from profile','Покажи отново в профила':'Show on profile again','Видим в профила':'Visible on profile','Скрит':'Hidden','⚑ Подай сигнал':'⚑ Report','Какво се случи?':'What happened?','Изпрати сигнал':'Send report','Подай сигнал':'Report a problem','Към търсенето':'Go to search','Сигнал се подава от профила на специалиста, с когото си се свързал (чат, оферта или поръчка).':'Reports are filed from the profile of a professional you have contacted (chat, offer or order).','напр. неизпълнена поръчка, закъснение…':'e.g. unfinished job, delay…','Сигнал срещу автора на отзив':'Report against review author','Не е посочен конкретен човек':'No specific person given','Срещу човек':'Against a person','За отзив':'About a review','Общи':'General','Срещу кого е сигналът?':'Who is the report against?','Не е срещу конкретен човек':'Not against a specific person','Хора, с които си работил':'People you worked with','Други специалисти':'Other professionals','Относно (кратко)':'Subject (short)','напр. неизпълнена поръчка, грубо държание…':'e.g. unfinished job, rude behaviour…','⚑ Докладвай':'⚑ Report','⚑ Докладвай този специалист':'⚑ Report this professional','← Назад':'← Back','Всички заявки на този клиент':'All requests by this customer','Изтрит потребител':'Deleted user','Администратор':'Admin','за преглед':'to review','няма нови':'none new','Без дата':'No date','Без име':'No name','Маркирай демо проверен':'Mark as verified (demo)','Отмени демо проверка':'Remove demo verification',
  'Сигналът е записан':'Report saved','Отвори':'Open',
  // subscriptions (errors from the database)
  'Нужен е активен абонамент, за да публикувате заявка.':'You need an active subscription to post a request.',
  'Нужен е активен абонамент, за да направите резервация.':'You need an active subscription to make a booking.',
  'Нужен е активен абонамент, за да изпращате оферти.':'You need an active subscription to send quotes.',
  'Нужен е активен абонамент, за да добавяте в портфолиото.':'You need an active subscription to add portfolio projects.',
  'Можете да отговорите само веднъж на отзив за вас':'You can reply only once to a review about you','Само администратор може да скрива отзиви':'Only an administrator can hide reviews',
  'Отговорът трябва да е между 1 и 1000 символа':'The reply must be 1 to 1000 characters',
  'SERVORA — интеграционен тест':'SERVORA — integration test','София област':'Sofia Province'
};

Object.assign(I18N, {
  'Виж кой е най-близо':'See who is nearest','Обнови местоположението ми':'Update my location','Най-близо до мен':'Nearest to me','Запазени':'Saved','Упътване':'Directions','Старт':'Start','Обади се':'Call','Запази':'Save','Запазен':'Saved','Сподели':'Share','Препрати':'Forward','Уебсайт':'Website','Копирай линк':'Copy link','Затвори':'Close','Препрати профила':'Forward profile',
  'Местоположение':'Location','задължително':'required','Адрес':'Address','Моето местоположение':'My location','Намери адреса':'Find address','Телефон за връзка':'Contact phone','Уебсайт (по желание)':'Website (optional)',
  'По него клиентите виждат колко си близо и стигат до теб с навигация.':'Customers use it to see how close you are and to navigate to you.',
  'Добави местоположението си':'Add your location','Задай местоположение':'Set location','Картата не можа да се зареди.':'The map could not be loaded.',
  'То е задължително. Без него клиентите не те виждат в „Най-близо до мен“ и не могат да стигнат до теб с навигация.':'It is required. Without it customers cannot see you in “Nearest to me” or navigate to you.',
  '✅ Точката е зададена. Докосни картата или влачи карфицата, за да я смениш.':'✅ Location set. Tap the map or drag the pin to change it.',
  '✅ Точката е зададена. Натисни „Запази профила“, за да я запишеш.':'✅ Location set. Press “Save profile” to keep it.',
  '⚠️ Още няма точка. Натисни „Моето местоположение“, потърси адреса или докосни картата.':'⚠️ No location yet. Press “My location”, search the address or tap the map.',
  'Търсим къде се намираш…':'Finding your location…','Разреши достъп до местоположението в настройките на браузъра':'Allow location access in your browser settings','Не успяхме да намерим местоположението ти':'We could not find your location',
  'Задай местоположението си – то е задължително':'Set your location – it is required','Невалиден телефонен номер':'Invalid phone number','Невалиден адрес на уебсайт':'Invalid website address','Напиши адрес':'Enter an address',
  'Не намерихме адреса. Докосни точното място на картата.':'Address not found. Tap the exact spot on the map.','Търсенето не успя. Докосни точното място на картата.':'Search failed. Tap the exact spot on the map.',
  'Видео програма':'Video plan','Видео програма за социалните мрежи':'Social media video plan','Публикувай редовно – клиентите ще те запомнят.':'Post regularly – customers will remember you.',
  'Седмичен график за клиповете ти в TikTok, Instagram, YouTube и Facebook. Ние ти напомняме в точния час.':'A weekly schedule for your clips on TikTok, Instagram, YouTube and Facebook. We remind you at the right time.',
  'Бързо начало – готов план от нас':'Quick start – a ready plan from us','Лек старт':'Easy start','Препоръчан':'Recommended','Максимален растеж':'Maximum growth','Използвай':'Use',
  'Хората, които търсят майстор, гледат най-много вечер след работа (19–21 ч.) и в събота и неделя сутрин, когато планират ремонти. Затова планът е подреден точно в тези часове.':'People looking for a tradesperson watch most in the evening after work (7–9 pm) and on weekend mornings, when they plan renovations. The plan uses exactly those hours.',
  '3 клипа седмично – вторник и четвъртък вечер, събота сутрин. За начало.':'3 clips a week – Tuesday and Thursday evening, Saturday morning. To get started.',
  '5 клипа седмично в най-гледаните часове за всяка мрежа. Най-добър резултат за усилието.':'5 clips a week at the most-watched hours for each network. Best result for the effort.',
  'Всеки ден + още един клип във вторник. За бърз ръст на последователите.':'Every day + one more clip on Tuesday. For fast follower growth.',
  'Моята седмица':'My week','Или си направи сам: за всеки ден избери час и мрежите. 🔥 означава час с най-много гледания.':'Or build your own: pick a time and networks for each day. 🔥 marks the most-watched hours.',
  'Понеделник':'Monday','Вторник':'Tuesday','Сряда':'Wednesday','Четвъртък':'Thursday','Петък':'Friday','Събота':'Saturday','Неделя':'Sunday',
  '+ Добави час':'+ Add time','Почивен ден – без публикации.':'Day off – no posts.','Всички':'All','Силен час':'Strong time','Добър час за част от мрежите':'Good time for some networks','Слаб час – по-малко гледания':'Weak time – fewer views',
  'Повтаряй програмата всяка седмица автоматично':'Repeat the plan every week automatically','Имаш незапазени промени.':'You have unsaved changes.','Запази програмата':'Save plan','Добави в календара':'Add to calendar',
  'Следващите 7 дни':'Next 7 days','Публикувай':'Post','Готово':'Done','Пропусни':'Skip','Публикувано':'Posted','Пропуснато':'Skipped','Време е за публикуване!':'Time to post!',
  'Още няма планирани публикации. Избери план и натисни „Запази програмата“.':'No planned posts yet. Pick a plan and press “Save plan”.','Програмата е запазена':'Plan saved',
  'Как клиповете да се гледат повече':'How to get more views','Видео програмата е за специалисти.':'The video plan is for professionals.',
  'Линкът е копиран':'Link copied','Добавен в „Запазени“':'Added to “Saved”','Премахнат от „Запазени“':'Removed from “Saved”','ул., номер, квартал':'street, number, district'
});
const I18N_PATTERNS = [
  [/^(.+) от теб$/, '$1 from you'], [/^Запазени (\d+)$/, 'Saved $1'], [/^Изпрати (.+) на приятел\.$/, 'Send $1 to a friend.'],
  [/^Показани: (\d+)$/, 'Shown: $1'], [/^Изпратихме писмо на (.+)\.$/, 'We sent an email to $1.'], [/^Натисни линка „Reset Password“ в него\.$/, 'Tap the “Reset Password” link in it.'], [/^⛔ Спрян до (.+)$/, '⛔ Suspended until $1'], [/^⛔ Блокиран безсрочно$/, '⛔ Blocked permanently'], [/^Причина: (.+)$/s, (m, r) => 'Reason: ' + r], [/^Спрян на: (.+)$/, 'Suspended on: $1'], [/^Ще бъде активен отново на (.+)\.$/, 'It will be active again on $1.'], [/^⛔ Профилът на (.+) е временно недостъпен\.$/, '⛔ $1\'s profile is temporarily unavailable.'], [/^⚑ Сигнали от клиенти \((\d+)\)$/, '⚑ Customer reports ($1)'], [/^⚑ Сигнали срещу този човек: (\d+)$/, '⚑ Reports against this person: $1'], [/^⚑ Сигнали: (\d+)$/, '⚑ Reports: $1'], [/^(\d+) клиенти · (\d+) специалисти$/, '$1 customers · $2 professionals'], [/^(\d+) отворени$/, '$1 open'], [/^(\d+) активни$/, '$1 active'],
  [/^Оферти \((\d+)\)$/, 'Offers ($1)'], [/^Всички \((\d+)\)$/, 'All ($1)'], [/^Със снимки \((\d+)\)$/, 'With photos ($1)'],
  [/^(\d+) специалист(и)?$/, (m, n) => `${n} professional${n === '1' ? '' : 's'}`], [/^📍 (.+)$/, (m, c) => '📍 ' + tr(c)],
  [/^(\d+) отзива?$/, (m, n) => `${n} review${n === '1' ? '' : 's'}`], [/^(\d+) оферт[аи] →$/, (m, n) => `${n} offer${n === '1' ? '' : 's'} →`],
  [/^([\d.,]+) от 5$/, '$1 out of 5'], [/^Оцени (.+)$/, (m, s) => 'Rate ' + (s === 'специалиста' ? 'the professional' : s)],
  [/^Отговор от (.+)$/, 'Reply from $1'], [/^Колко си доволен от (.+)\?$/, 'How happy are you with $1?'], [/^Как мина работата с (.+)\?$/, 'How did the job with $1 go?'], [/^✓ Вече си оценил (.+)$/, '✓ You already rated $1'],
  [/^Имаш поръчка при (.+)\. Щом специалистът я маркира като завършена, ще можеш да го оцениш тук\.$/, 'You have an order with $1. Once they mark it as completed, you can rate them here.'], [/^Сигнал за отзив към (.*)$/, 'Report about a review of $1'], [/^Здравей, (.+)\.$/, 'Hi, $1.'],
  [/^Нова оферта за (.+)$/, 'New offer for $1'], [/^Нова заявка: (.+)$/, 'New request: $1'], [/^Ново съобщение от (.+)$/, 'New message from $1'],
  [/^(.+) отговори на твоя отзив$/, '$1 replied to your review'],
  [/^(\d+) (снимка е добавена|снимки са добавени)$/, (m, n) => `${n} photo${n === '1' ? '' : 's'} added`],
  [/^(\d+) не може да се отвори \(опитай JPG или PNG\)$/, "$1 couldn't be opened (try JPG or PNG)"], [/^(\d+) е над 40 MB$/, '$1 is over 40 MB'],
  [/^може най-много (\d+)$/, 'up to $1 allowed'], [/^Може най-много (\d+) снимки$/, 'You can add up to $1 photos'], [/^Достигнахте лимита от (\d+) оферти за месеца\. Преминете към по-висок пакет\.$/, 'You reached the limit of $1 quotes this month. Upgrade your plan.'],
  [/^Достигнахте лимита от (\d+) проекта в портфолиото\. Преминете към по-висок пакет\.$/, 'You reached the limit of $1 portfolio projects. Upgrade your plan.'],
  [/^\(до (\d+)\)$/, '(up to $1)'], [/^обл\. (.+)$/, (m, p) => 'prov. ' + placeEn(p)], [/^общ\. (.+), обл\. (.+)$/, (m, a, b) => `mun. ${placeEn(a)}, prov. ${placeEn(b)}`]
];

const TRANSLIT = {а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sht',ъ:'a',ь:'y',ю:'yu',я:'ya'};
const latin = s => s.replace(/[а-яА-Я]/g, ch => { const l = ch.toLowerCase(), t = TRANSLIT[l] ?? l; return ch === l ? t : t.charAt(0).toUpperCase() + t.slice(1) });
function placeEn(s) {
  if (s === 'София област') return 'Sofia Province';
  return latin(String(s).replace(/^с\. /, 'v. ').replace(/^к\.к\. /, 'resort ').replace(/\(общ\. /, '(mun. ').replace(/\(обл\. /, '(prov. '));
}
const isPlace = s => (typeof CITY_SET !== 'undefined' && CITY_SET.has(s)) || /^(с\.|к\.к\.) \S/.test(s);

// Translate one piece of UI text. Unknown text (user content) is returned unchanged.
function tr(s) {
  if (LANG !== 'en' || !s || !/[а-яА-Я]/.test(s)) return s;
  if (I18N[s]) return I18N[s];
  for (const [re, to] of I18N_PATTERNS) if (re.test(s)) return s.replace(re, to);
  if (isPlace(s)) return placeEn(s);
  if (s.includes(' · ')) return s.split(' · ').map(tr).join(' · ');
  let m = s.match(/^(Грешка): (.+)$/s); if (m) return 'Error: ' + tr(m[2]);
  m = s.match(/^([^:]{2,40}): (.*)$/s); if (m && I18N[m[1]]) return I18N[m[1]] + ': ' + tr(m[2]);
  m = s.match(/^(.+?) (\(.+\))$/); if (m && (I18N[m[1]] || I18N[m[2]])) return tr(m[1]) + ' ' + tr(m[2]);
  m = s.match(/^([^\p{L}]+)(.+)$/u); if (m) { const t = tr(m[2]); if (t !== m[2]) return m[1] + t }
  m = s.match(/^(.+?)([\s.:…?!,→]+)$/); if (m) { const t = tr(m[1]); if (t !== m[1]) return t + m[2] }
  return s;
}
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA']);
function trAttrs(n) { for (const a of ['placeholder', 'title', 'aria-label', 'alt']) { const v = n.getAttribute(a); if (v) { const x = tr(v.trim()); if (x !== v.trim()) n.setAttribute(a, x) } } }
function trNode(root) {
  if (LANG !== 'en' || !root) return;
  if (root.nodeType === 3) { const v = root.nodeValue, t = v.trim(); if (t) { const x = tr(t); if (x !== t) root.nodeValue = v.replace(t, x) } return }
  if (root.nodeType !== 1 || SKIP_TAGS.has(root.tagName) || root.closest?.('[data-ugc]')) return;
  for (const a of ['placeholder', 'title', 'aria-label', 'alt']) { const v = root.getAttribute?.(a); if (v) { const x = tr(v.trim()); if (x !== v.trim()) root.setAttribute(a, x) } }
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => { if (n.nodeType !== 1) return NodeFilter.FILTER_ACCEPT; if (n.tagName === 'TEXTAREA') { trAttrs(n); return NodeFilter.FILTER_REJECT } return SKIP_TAGS.has(n.tagName) || n.hasAttribute('data-ugc') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT } });
  let n; while ((n = w.nextNode())) { if (n.nodeType === 3) { const v = n.nodeValue, t = v.trim(); if (t) { const x = tr(t); if (x !== t) n.nodeValue = v.replace(t, x) } } else for (const a of ['placeholder', 'title', 'aria-label', 'alt']) { const v = n.getAttribute(a); if (v) { const x = tr(v.trim()); if (x !== v.trim()) n.setAttribute(a, x) } } }
}
const i18nObserver = new MutationObserver(list => { if (LANG !== 'en') return; for (const m of list) m.addedNodes.forEach(trNode) });
function applyLang() {
  document.documentElement.lang = LANG;
  document.title = LANG === 'en' ? 'SERVORA — find a professional' : 'SERVORA — намери специалист';
  if (LANG === 'en') { i18nObserver.observe(document.body, { childList: true, subtree: true }); trNode(document.body) } else i18nObserver.disconnect();
}
function setLang(l) { LANG = l === 'en' ? 'en' : 'bg'; try { localStorage.setItem('servora-lang', LANG) } catch {} applyLang(); if (typeof render === 'function') render() }
document.addEventListener('DOMContentLoaded', applyLang);

// ---------- Word suggestions while typing ----------
const WORDS_BG = ('ремонт ремонта ремонти боядисване боядисам боя бояджия стени стена таван тавани под подове плочки фаянс теракот фуги шпакловка шпакловане гипсокартон замазка мазилка ' +
 'изолация хидроизолация топлоизолация фасада покрив покрива керемиди улуци комин баня банята кухня кухнята спалня хол дневна коридор тераса балкон мазе таван апартамент апартамента къща къщата ' +
 'вила офис магазин гараж двор двора градина градината ограда врата врати прозорец прозорци дограма стъкло ключалка брава паркет ламинат мокет циклене лакиране ' +
 'електроинсталация електричество ел контакт контакти ключ ключове осветление лампа лампи полилей табло бушон кабел кабели ' +
 'водопровод ВиК тръба тръби течове теч пробив смесител мивка тоалетна казанче душ кабина вана бойлер радиатор радиатори парно климатик климатици монтаж монтиране демонтаж ' +
 'смяна сменям поставяне поставям почистване почистя почиствам основно седмично ежемесечно пране миене диван дивани килим килими матрак мебели гардероб шкаф шкафове сглобяване ' +
 'косене трева тревата подрязване дървета храсти жив плет озеленяване поливна система поливане засаждане разсад листа сняг почистване ' +
 'автомобил колата кола масло накладки спирачки гуми джанти акумулатор диагностика полиране тапицерия двигател съединител ' +
 'спешно спешен днес утре възможно скоро седмица уикенд събота неделя сутрин следобед вечер час часа ден дни ' +
 'нужен нужна нужно нужни търся трябва искам имам моля може можете бихте ли колко цена цената бюджет оферта оферти материали материал включени включен ' +
 'квадратни квадрата кв.м метра метър етаж етажа асансьор паркиране достъп адрес квартал ' +
 'стар стара старо нов нова ново голям голяма малък малка цялата целия частично качествено бързо чисто внимателно опит снимки снимка прикачени').split(' ');
const WORDS_EN = ('repair repairs renovation paint painting painter walls wall ceiling floor floors tiles tiling grout plastering plaster drywall insulation waterproofing facade roof gutters ' +
 'chimney bathroom kitchen bedroom living room hallway terrace balcony basement apartment house villa office shop garage yard garden fence door doors window windows lock parquet laminate ' +
 'electrical electricity socket sockets switch switches lighting lamp lamps fuse cable plumbing pipe pipes leak leaking faucet sink toilet shower bathtub boiler radiator heating ' +
 'air conditioner installation install remove removal replacement replace cleaning clean deep weekly monthly washing sofa carpet mattress furniture wardrobe cabinet assembly ' +
 'mowing lawn grass pruning trees bushes hedge landscaping irrigation watering planting leaves snow car oil brakes brake pads tires battery diagnostics polishing engine ' +
 'urgent today tomorrow soon week weekend saturday sunday morning afternoon evening hour hours day days need needed looking want please can could how much price budget quote ' +
 'materials included square meters floor elevator parking access address old new big small whole partial quality fast careful experience photos photo attached').split(' ');
const VOC_EN = { 'Ремонти и строителство': ['wall painting', 'plastering', 'tiling', 'bathroom renovation', 'electrical wiring', 'replacing sockets', 'drywall installation', 'roof repair', 'laminate flooring'],
 'Почистване': ['apartment cleaning', 'post-renovation cleaning', 'sofa cleaning', 'window cleaning', 'deep cleaning', 'office cleaning'],
 'Двор и градина': ['lawn mowing', 'tree pruning', 'landscaping', 'irrigation system', 'yard cleanup'],
 'Автоуслуги': ['oil change', 'brake pad replacement', 'car diagnostics', 'car polishing', 'brake repair', 'car cleaning'] };
const learnKey = () => 'servora-words-' + LANG;
function learnedWords() { try { return JSON.parse(localStorage.getItem(learnKey()) || '{}') } catch { return {} } }
function learnFrom(text) {
  try { const m = learnedWords(); for (const w of String(text).toLowerCase().match(/[\p{L}]{4,}/gu) || []) m[w] = (m[w] || 0) + 1;
    const top = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 400); localStorage.setItem(learnKey(), JSON.stringify(Object.fromEntries(top))) } catch {}
}
// Suggestions for the word under the cursor; after a space it offers how the phrase usually continues.
function wordCandidates(el) {
  const pos = el.selectionStart ?? el.value.length, head = el.value.slice(0, pos);
  const cat = document.querySelector('#category')?.value || '', phrases = LANG === 'en' ? (VOC_EN[cat] || Object.values(VOC_EN).flat()) : (VOC[cat] || Object.values(VOC).flat());
  const part = head.match(/([\p{L}.-]+)$/u)?.[1] || '';
  const lower = part.toLowerCase(), out = [], add = (w, type) => { if (w && w.toLowerCase() !== lower && !out.some(x => x.text === w) && out.length < 6) out.push({ text: w, type }) };
  if (part) {
    const before = head.slice(0, head.length - part.length).toLowerCase().match(/([\p{L}]+\s+){0,2}$/u)?.[0]?.trim() || '';
    for (const p of phrases) { const pl = p.toLowerCase(); if (before && pl.startsWith(before + ' ' + lower)) add(p.slice(before.length + 1), 'phrase') }
    for (const p of phrases) if (p.toLowerCase().startsWith(lower)) add(p, 'phrase');
    const learned = Object.entries(learnedWords()).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    for (const w of [...learned, ...(LANG === 'en' ? WORDS_EN : WORDS_BG)]) if (w.toLowerCase().startsWith(lower)) add(part[0] === part[0].toUpperCase() && part[0] !== part[0].toLowerCase() ? w[0].toUpperCase() + w.slice(1) : w, 'word');
  } else {
    const prev = head.toLowerCase().match(/([\p{L}]+(?:\s+[\p{L}]+)?)\s+$/u)?.[1];
    if (prev) for (const p of phrases) { const pl = p.toLowerCase(); for (const pre of [prev, prev.split(/\s+/).pop()]) if (pl.startsWith(pre + ' ')) add(p.slice(pre.length + 1), 'next') }
  }
  return { part, list: out };
}
function wordSuggest(el) {
  const box = el.closest('label')?.nextElementSibling; if (!box || !box.classList.contains('wsug')) return;
  const { list } = wordCandidates(el); el._ws = list;
  box.innerHTML = list.map((s, i) => `<button type="button" class="${s.type}" onmousedown="event.preventDefault()" onclick="wordPick(this,${i})">${esc(s.text)}</button>`).join('');
  box.classList.toggle('on', !!list.length);
}
function wordPick(btnEl, i) {
  const box = btnEl.closest('.wsug'), el = box.previousElementSibling.querySelector('textarea,input'), s = el?._ws?.[i]; if (!s) return;
  const pos = el.selectionStart ?? el.value.length, head = el.value.slice(0, pos), tail = el.value.slice(pos), part = s.type === 'next' ? '' : (head.match(/([\p{L}.-]+)$/u)?.[1] || '');
  const before = head.slice(0, head.length - part.length), ins = s.text + (tail.startsWith(' ') ? '' : ' ');
  el.value = before + ins + tail; const c = before.length + ins.length; el.setSelectionRange(c, c); el.focus(); wordSuggest(el);
}
function wordKey(e, el) { if ((e.key === 'Tab' && !e.shiftKey) && el._ws?.length && el.closest('label')?.nextElementSibling?.classList.contains('on')) { e.preventDefault(); wordPick(el.closest('label').nextElementSibling.querySelector('button'), 0) } }
const wsAttrs = 'oninput="wordSuggest(this)" onkeydown="wordKey(event,this)" onclick="wordSuggest(this)" onblur="setTimeout(()=>{const b=this.closest(\'label\')?.nextElementSibling;if(b?.classList.contains(\'wsug\')){b.classList.remove(\'on\');b.innerHTML=\'\'}},200)" autocomplete="off"';
