const menuForm = document.getElementById("espresso-menu-form");
const menuInput = document.querySelector("#espresso-menu-form input");
const menuList = document.getElementById("espresso-menu-list");
const menuCountText = document.querySelector(".menu-count");
const menuSubmitBtn = document.querySelector("#espresso-menu-submit-button");
const nav = document.querySelector("nav");

let menu = {
  espresso: [],
  frappuccino: [],
  blended: [],
  teavana: [],
  desert: [],
};

// 최초 페이지
let currentCategory = "espresso";

// const getLocalStorage = localStorage.getItem("menu");

function setLocalStorage() {
  localStorage.setItem("menu", JSON.stringify(menu));
}
const getLocalStorage = JSON.parse(localStorage.getItem("menu"));

// 메뉴 수 카운트
const updateMenuCount = () => {
  const menuCount = menuList.querySelectorAll("li").length;
  menuCountText.textContent = `총 ${menuCount}개`;
};

function paintMenu() {
  menuList.innerHTML = "";
  menu[currentCategory].map((item, index) => {
    const template = `
      <li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">
        <span class="${item.soldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${
      item.name
    }</span>
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >   
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>
    `;
    menuList.insertAdjacentHTML("beforeend", template);
  });

  updateMenuCount();
}

// 메뉴 입력 (Enter)
function handleAddSubmit(e) {
  e.preventDefault();
  const newAdd = menuInput.value;
  menuInput.value = "";
  menu[currentCategory].push({ name: newAdd });
  setLocalStorage();
  paintMenu();
}

// 메뉴 입력 (확인 버튼)
function handleAddSubmitBtn(e) {
  e.preventDefault();
  const newAdd = menuInput.value;
  menuInput.value = "";
  if (newAdd === "") {
    alert("메뉴 이름을 입력해주세요.");
  } else {
    menu[currentCategory].push({ name: newAdd });
    setLocalStorage();
    paintMenu();
  }
}

const handleMenuList = function (e) {
  const menuId = e.target.closest("li").dataset.menuId;

  // 수정 기능
  if (e.target.classList.contains("menu-edit-button")) {
    const value = prompt("메뉴명을 수정하세요", "");
    if (value.replace(" ", "").length === 0) {
      alert("메뉴 이름을 입력해주세요.");
      return;
    } else {
      e.target.closest("li").querySelector(".menu-name").textContent = value;
      menu[currentCategory][menuId] = value;
      setLocalStorage();
    }
  }

  // 삭제 기능
  if (e.target.classList.contains("menu-remove-button")) {
    if (confirm("이 메뉴를 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      const menuId = e.target.closest("li").dataset.menuId;
      menu[currentCategory].splice(menuId, 1);
      setLocalStorage();
      paintMenu();
    }
  }

  // 품절 기능
  if (e.target.classList.contains("menu-sold-out-button")) {
    soldOutMenu(e);
  }
};

const soldOutMenu = (e) => {
  const menuId = e.target.closest("li").dataset.menuId;
  menu[currentCategory][menuId].soldOut =
    !menu[currentCategory][menuId].soldOut;
  setLocalStorage();
  paintMenu();
};

const handleNav = (e) => {
  const isCategoryButton = e.target.classList.contains("cafe-category-name");
  if (isCategoryButton) {
    currentCategory = e.target.dataset.categoryName;
    document.querySelector(
      "#category-name"
    ).textContent = `${e.target.textContent} 메뉴 관리`;
    paintMenu();
  }
};

nav.addEventListener("click", handleNav);
menuForm.addEventListener("submit", handleAddSubmit);
menuList.addEventListener("click", handleMenuList);
menuSubmitBtn.addEventListener("click", handleAddSubmitBtn);

if (getLocalStorage !== null) {
  // const parsedmenu = JSON.parse(getLocalStorage);
  // menu = parsedmenu;
  menu = getLocalStorage;
  paintMenu();
}

// 1. 메뉴 수정/삭제하기 >> ( menu : [] -> menu : {})
// 2. 리팩토링 >> forEach -> map >> 코드 약 20줄 줄임

// 이벤트 위임 이해
// 수정, 삭제, 품절 분리
