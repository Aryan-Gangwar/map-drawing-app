# 🗺️ Map Drawing Application (React + TypeScript)

A frontend web application built using **React.js + TypeScript** that renders **OpenStreetMap free tiles**, allows users to **draw and manage geometrical shapes**, enforces **spatial constraints on polygons**, and supports **GeoJSON export**.

This project is developed as part of a **Frontend Development Assignment** focusing on map handling, spatial logic, clean architecture, and code organization.

---

## 🚀 Features

### ✅ Map Rendering

* Uses **OpenStreetMap** free tiles
* Smooth **zooming & panning**
* Built with **Leaflet** and **React-Leaflet**

### ✏️ Drawing Tools

Users can draw:

* 🟢 Circle
* ◼️ Rectangle
* 🔺 Polygon
* ➖ Line String

Drawing is done via **Leaflet Draw toolbar** (no modal popups).

### 📐 Polygon Constraints (Important)

Rules apply **only to polygonal shapes** (Circle, Rectangle, Polygon):

* ❌ **No overlapping polygons**
* ✂️ If partial overlap occurs → polygon is **auto-trimmed**
* 🚫 If a polygon **fully contains another polygon** → blocked with error
* ➖ **Line Strings are excluded** from overlap rules

All spatial logic is handled using **Turf.js**.

### 📤 Export GeoJSON

* Export **all drawn features** as a single **GeoJSON file**
* Includes geometry + properties (shape type)
* Clean separation using a **service layer**

### ⚙️ Dynamic Configuration

* Maximum allowed shapes per type (polygon, circle, etc.) are **configurable**
* Limits are defined in one place and can be easily changed

---

## 🧱 Tech Stack

* **React.js**
* **TypeScript**
* **Vite**
* **Leaflet**
* **React-Leaflet**
* **Leaflet Draw**
* **Leaflet Control Geocoder**
* **Turf.js**

---

## 📁 Project Folder Structure

```bash
src/
├── components/
│   ├── MapView.tsx        # Main map & drawing logic
│   ├── SearchControl.tsx  # Location search control
│   ├── ExportButton.tsx   # Export button (UI only)
│   ├── Toolbar.tsx        # Toolbar wrapper
│
├── hooks/
│   └── useDraw.ts         # Drawing related hooks
│
├── services/
│   └── geojsonService.ts  # GeoJSON export logic
│
├── utils/
│   ├── geometry.ts        # Polygon normalize & overlap logic
│   └── limits.ts          # Dynamic shape limits
│
├── types/
│   └── map.ts             # Shared TypeScript types
│
├── App.tsx
├── main.tsx
└── index.css
```

✅ This structure follows **clean architecture** with proper separation:

* UI → `components`
* Logic → `hooks`, `utils`
* Side-effects / downloads → `services`
* Types → `types`

---

## 🧠 Polygon Overlap Logic (Explanation)

Polygon rules are implemented in:

```
src/utils/geometry.ts
```

### Logic Flow:

1. **Normalize shapes** (Circle → Polygon using Turf)
2. Compare new polygon with existing polygons
3. Apply rules:

   * If polygon **contains or is contained** → ❌ block
   * If polygon **intersects partially** → ✂️ trim using `turf.difference`
   * If result is `MultiPolygon` → keep **largest area**

This ensures:

* No overlapping regions
* Clean geometry output
* Predictable UX

---

## 📤 GeoJSON Export (How it works)

* `ExportButton.tsx` → UI only
* Calls export function from:

```
src/services/geojsonService.ts
```

### Export includes:

* Geometry
* Shape type (Polygon / Circle / LineString etc.)

File is downloaded as:

```
map-features.geojson
```

---

## 🔍 Search Behavior

* Location search via **Leaflet Control Geocoder**
* Marker & highlight appear **only after search**
* Clearing (❌ cross) resets:

  * Marker removed
  * Map returns to **default center & zoom**
* No UI changes were made to the default search control

---

## ⚙️ Dynamic Configuration (Limits)

Defined in:

```
src/utils/limits.ts
```

Example:

```ts
export const SHAPE_LIMITS = {
  polygon: 10,
  circle: 5,
  rectangle: 5,
  polyline: 20,
}
```

Limits can be changed **without touching business logic**.

---

## ▶️ Setup & Run Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-github-repo-url>
cd map-drawing-app
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 📄 Sample GeoJSON Output

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "shape": "polygon"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      }
    }
  ]
}
```

---

## 🌐 Deployment

The project can be deployed on:

* Vercel
* Netlify
* GitHub Pages

---

## ✅ Assignment Checklist

✔ OpenStreetMap tiles
✔ Drawing tools (Polygon, Circle, Rectangle, LineString)
✔ Non-overlapping polygon logic
✔ Auto-trimming using Turf.js
✔ GeoJSON export
✔ Dynamic configuration
✔ Clean folder structure
✔ TypeScript strict typing



