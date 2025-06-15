
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

---

### 📌 **interviewing.io blog** (href)

**Source URL:**

```text
https://interviewing.io/blog
```

**Tag for Article Links:**

```text
h1 > a[href^="/blog/"]
```

**Title Tag:**

```text
h1
```

**Markdown Tag:**

```text
div[class^="leading-7"] > p
```

---

### 📌 **interviewing.io company guides** (href)

**Source URL:**

```text
https://interviewing.io/topics
```

**Tag for Article Links:**

```text
.flex-1.px-1.py-2.hover\:bg-gray-100 > a[href^="/guides/"]
```

**Title Tag:**

```text
.font-serif.text-\[56px\].text-white-100
```

**Markdown Tag:**

```text
.mb-\[128px\].gap-\[20px\].flex-col
```

---

### 📌 **nilmamano** (href)

**Source URL:**

```text
https://nilmamano.com/blog/category/dsa
```

**Tag for Article Links:**

```text
.mt-4 > a[href^="/blog/"]
```

**Title Tag:**

```text
.text-3xl.font-bold
```

**Markdown Tag:**

```text
.prose
```

---

### 📌 **quill** (click)

**Source URL:**

```text
https://quill.co/blog
```

**Tag for Article Links:**

```text
.bg-white.p-\[30px\].hover\:bg-slate-50
```

**Title Tag:**

```text
h1[class*="text-[48px]"]
```

**Markdown Tag:**

```text
.text-slate-700.px-7.md\:px-12.py-1.text-\[18px\]
```

---


