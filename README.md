You're absolutely right — let’s make it clean so everything can be copied in one go without unnecessary fencing.

Here’s your **complete, clean `README.md`** content — ready for direct use:

---

# Test App

## Getting Started

Follow these steps to set up and run the app locally:

1️⃣ **Clone the repository**

```bash
git clone https://github.com/Shubhamxshah/ogtool
```

2️⃣ **Frontend setup**

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm run dev
cd ..
```

3️⃣ **Backend setup**

```bash
cd backend
npm install
npm run build
npm start
```

---

## Start Testing

You can use the following inputs to test the scraper:

### interviewing.io blog (href)

[https://interviewing.io/blog](https://interviewing.io/blog)
h1 > a\[href^="/blog/"]
h1
div\[class^="leading-7"] > p

---

### quill (click)

[https://quill.co/blog](https://quill.co/blog)
.bg-white.p-$30px$.hover\:bg-slate-50
h1\[class\*="text-\[48px]"]
.text-slate-700.px-7.md\:px-12.py-1.text-$18px$

---

### interviewing.io company guides (href)

[https://interviewing.io/topics](https://interviewing.io/topics)
.flex-1.px-1.py-2.hover\:bg-gray-100 > a\[href^="/guides/"]
.font-serif.text-$56px$.text-white-100
.mb-$128px$.gap-$20px$.flex-col

---

### nilmamano (href)

[https://nilmamano.com/blog/category/dsa](https://nilmamano.com/blog/category/dsa)
.mt-4 > a\[href^="/blog/"]
.text-3xl.font-bold
.prose

---


