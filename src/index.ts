interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  category: string;
}
interface ApiResponse {
  data: Product[];
  message: string;
  error: string;
}
// async function catchCoffee(): Promise<void> {
//   try {
//     const response: Response = await fetch(
//       "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/favorites"
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status:`);
//     }

//     const data: Product[] = await response.json();
//     console.log(data); // veya data içinden category varsa: console.log(data.category);
//   } catch (error) {
//     console.error("Hata oluştu:", error);
//   }
// }
// catchCoffee();

// const slider: HTMLDivElement | null =
//   document.querySelector<HTMLDivElement>(".ortadakifav");

// const leftBtn: HTMLDivElement =
//   document.querySelector<HTMLButtonElement>(".soloklar")!;

// const rightBtn: HTMLDivElement =
//   document.querySelector<HTMLButtonElement>(".sagoklar")!;

let slidesData: Product[] = [];

let currentIndex: number = 0;

let interval: number | undefined;

async function fetchSlides(): Promise<void> {
  const loader: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".loader");

  const slider: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".selamlar");

  const errortext: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".hatamesaji");

  try {
    const res: Response = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites"
    );
    if (!res.ok) {
      throw new Error("Sunucu hatası: " + res.status);
    }
    const json: ApiResponse = await res.json(); //     console.log(json);
    const data: Product[] = json.data;

    slidesData = data.map((item: Product) => ({
      ...item,
    }));
    console.log(slidesData);

    showSlide(currentIndex);
    startAutoSlide();
    loader?.classList.add("active");
    slider?.classList.add("active"); // ✅ Sadece veri geldiyse slider görünür

    // showSlide(currentIndex);
    // startAutoSlide();
    //createSlidessecond();
    //createSlides();
    // showSlide(current);
    // startAutoSlide();
  } catch (error) {
    console.error("Veri çekilemedi:", error);
    loader?.classList.add("active");
    errortext?.classList.add("active");
  }
}

// function createSlides(): void {
//   slider.innerHTML = "";
//   slidesData.forEach((item) => {
//     const div: HTMLDivElement = document.createElement("div");
//     div.classList.add("slide");
//     div.style.backgroundImage = `url(${item.img})`;
//     div.textContent = item.text;
//     slider.appendChild(div);
//   });
// }

// function createSlides(): void {
//   const slider: HTMLDivElement | null =
//     document.querySelector<HTMLDivElement>(".ortadakifav");
//   if (!slider) {
//     console.error("Slider elementi bulunamadı.");
//     return;
//   }

//   slider.innerHTML = "";

//   slidesData.forEach((item) => {
//     // const slide: HTMLDivElement | null = document.createElement("div");
//     // slide.classList.add("slide");
//     slider.innerHTML = `
//       <img src="../images/${item.name}.svg" alt="${
//       item.name
//     }" style ="width:480px; height:480px" />
//       <div  style ="display: flex;
//         flex-direction: column;
//         justify-content: space-between;
//         align-items: center;
//         height: 140px;
//         width: 480px;
//         gap: 16px;
//         flex-direction: column;">

//           <span   style="
//                         display: flex;
//                         justify-content: center;
//                         align-items: center;
//                         color: #403f3d;
//                         font-size: 24px;
//                         font-weight: bold;
//                         flex-direction: column;
//                             gap: 16px;
//                       ">${item.name}</span>
//           <span  style="
//                         font-size: 16px;
//                         line-height: 150%;
//                         color: #403f3d;
//                         text-align: center;
//                       ">${item.description}</span>

//         <span   style="
//                         display: flex;
//                         justify-content: center;
//                         align-items: center;
//                         color: #403f3d;
//                         font-size: 24px;
//                         font-weight: bold;
//                       ">$${Number(item.price).toFixed(2)}</span>
//       </div>
//     `;
//     //slider.appendChild(slide);
//   });
// }

function showSlide(index: number): void {
  const slider: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>(".ortadakifav");
  if (!slider) {
    console.error("Slider elementi bulunamadı.");
    return;
  }

  slider.innerHTML = ""; // Önceki slide'ı temizle

  const item: Product = slidesData[index];

  const slideImg: HTMLImageElement = document.createElement("img");
  slideImg.classList.add("yeniresim");
  slideImg.src = `/images/${item.name}.svg`;
  slideImg.alt = item.name;
  slider.appendChild(slideImg);

  const infoContainer: HTMLDivElement = document.createElement("div");
  infoContainer.classList.add("yeniyazilar");

  const spanTitle: HTMLSpanElement = document.createElement("span");
  spanTitle.classList.add("spanbaslik");
  spanTitle.textContent = item.name;

  const spanDesc: HTMLSpanElement = document.createElement("span");
  spanDesc.classList.add("spandesc");
  spanDesc.textContent = item.description;

  infoContainer.appendChild(spanTitle);
  infoContainer.appendChild(spanDesc);

  if (item.discountPrice === null) {
    const spanPrice: HTMLSpanElement = document.createElement("span");
    spanPrice.classList.add("spanprice");
    spanPrice.textContent = `$${Number(item.price).toFixed(2)}`;

    infoContainer.appendChild(spanPrice);
  } else {
    console.log("object");
    const priceContainer: HTMLDivElement = document.createElement("div");
    priceContainer.classList.add("pricecontain");

    const discountspanPrice: HTMLSpanElement = document.createElement("span");
    discountspanPrice.classList.add("spanprice");
    discountspanPrice.textContent = `$${Number(item.discountPrice).toFixed(2)}`;
    priceContainer.appendChild(discountspanPrice);

    const spanPrice: HTMLSpanElement = document.createElement("span");
    spanPrice.classList.add("spanpricefirst");
    spanPrice.textContent = `$${Number(item.price).toFixed(2)}`;
    priceContainer.appendChild(spanPrice);

    infoContainer.appendChild(priceContainer);
  }
  slider.appendChild(infoContainer);
  updateActiveControl();
}
function updateActiveControl(): void {
  const controls: NodeListOf<HTMLDivElement> =
    document.querySelectorAll<HTMLDivElement>(".control");
  controls.forEach((control: HTMLDivElement, index: number) => {
    control.classList.toggle("active", index === currentIndex);
  });
}

const leftBtn: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>(".soloklar");
const rightBtn: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>(".sagoklar");
console.log("sssssssssssss");
console.log(leftBtn);

// leftBtn?.addEventListener("click", () => {
//   console.log(currentIndex);
//   if (slidesData.length === 0) return;
//   currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
//   console.log(currentIndex);

//   showSlide(currentIndex);
// });

// rightBtn?.addEventListener("click", () => {
//   if (slidesData.length === 0) return;
//   currentIndex = (currentIndex + 1) % slidesData.length;
//   showSlide(currentIndex);
// });

//************* */
rightBtn?.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slidesData.length;
  showSlide(currentIndex);
  resetInterval();
});

// --- Sol ok ---
leftBtn?.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
  showSlide(currentIndex);
  resetInterval();
});

// --- Otomatik geçiş ---
function startAutoSlide(): void {
  interval = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % slidesData.length;
    showSlide(currentIndex);
  }, 5000);
}

function resetInterval(): void {
  clearInterval(interval);
  startAutoSlide();
}

// function createSlidessecond(): void {
//   const slider: HTMLDivElement | null =
//     document.querySelector<HTMLDivElement>(".ortadakifav");
//   if (!slider) {
//     console.error("Slider elementi bulunamadı.");
//     return;
//   }

//   slidesData.forEach((item) => {
//     // const slide: HTMLDivElement | null = document.createElement("div");
//     // slide.classList.add("slide");

//     const slide: HTMLImageElement = document.createElement("img");
//     slide.classList.add(".yeniresim");
//     slide.src = `../images/${item.name}.svg`;
//     slide.alt = item.name;
//     slider.appendChild(slide);

//     const yeniyazicontain: HTMLDivElement = document.createElement("div");
//     yeniyazicontain.classList.add("yeniyazilar");
//     slider.appendChild(yeniyazicontain);

//     const spanbaslik: HTMLSpanElement = document.createElement("span");
//     spanbaslik.classList.add("spanbaslik");
//     spanbaslik.textContent = item.name;
//     yeniyazicontain.appendChild(spanbaslik);

//     const spandesc: HTMLSpanElement = document.createElement("span");
//     spandesc.classList.add("spandesc");
//     spandesc.textContent = item.description;
//     yeniyazicontain.appendChild(spandesc);

//     const spanprice: HTMLSpanElement = document.createElement("span");
//     spanprice.classList.add(".spandesc");
//     spanprice.textContent = Number(item.price).toFixed(2);
//     yeniyazicontain.appendChild(spanprice);
//   });
// }

fetchSlides();
//createSlidessecond();
