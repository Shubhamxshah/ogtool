
---

# Test App

## Getting Started

Follow these steps to set up and run the app locally:

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Shubhamxshah/ogtool
```

### 2️⃣ Frontend setup

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm run dev
```

Go back to the root directory:

```bash
cd ..
```

### 3️⃣ Backend setup

```bash
cd backend
npm install
npm run build
npm start
```

---

## Start Testing

Below are example inputs you can use to test the scraper:

### 📌 **interviewing.io blog** (href)

**Source URL:**
[https://interviewing.io/blog](https://interviewing.io/blog)

**Tag for Article Links:**
h1 > a\[href^="/blog/"]

**Title Tag:**
h1

**Markdown Tag:**
div\[class^="leading-7"] > p

---

### 📌 **interviewing.io company guides** (href)

**Source URL:**
[https://interviewing.io/topics](https://interviewing.io/topics)

**Tag for Article Links:**
.flex-1.px-1.py-2.hover\:bg-gray-100 > a\[href^="/guides/"]

**Title Tag:**
.font-serif.text-$56px$.text-white-100

**Markdown Tag:**
.mb-$128px$.gap-$20px$.flex-col

---

### 📌 **nilmamano** (href)

**Source URL:**
[https://nilmamano.com/blog/category/dsa](https://nilmamano.com/blog/category/dsa)

**Tag for Article Links:**
.mt-4 > a\[href^="/blog/"]

**Title Tag:**
.text-3xl.font-bold

**Markdown Tag:**
.prose

---

### 📌 **quill** (click)

**Source URL:**
[https://quill.co/blog](https://quill.co/blog)

**Tag for Article Links:**
.bg-white.p-$30px$.hover\:bg-slate-50

**Title Tag:**
h1\[class\*="text-\[48px]"]

**Markdown Tag:**
.text-slate-700.px-7.md\:px-12.py-1.text-$18px$

---


