const menuForm = document.getElementById("espresso-menu-form");
const menuInput = document.querySelector("#espresso-menu-form input");
const menuList = document.getElementById("espresso-menu-list");
const menuCountText = document.querySelector(".menu-count");
const menuSubmitBtn = document.querySelector("#espresso-menu-submit-button");
const nav = document.querySelector("nav");

const BASE_URL = "http://localhost:3000/api";

let menu = {
  espresso: [],
  frappuccino: [],
  blended: [],
  teavana: [],
  desert: [],
};

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
  // async getAllMenuByCategory(category) {
  //   await fetch(`${BASE_URL}/category/${category}/menu`).then(
  //     async (response) => {
  //       return response.json();
  //     }
  //   );
  // }.then((data) =>{
  //     return data
  //   })
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },

  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
    return response.json();
  },

  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },

  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
};

// 최초 페이지
let currentCategory = "espresso";

function LocalStorageSet() {
  localStorage.setItem("menu", JSON.stringify(menu));
}
const LocalStorageGet = JSON.parse(localStorage.getItem("menu"));

// 메뉴 수 카운트
const updateMenuCount = () => {
  const menuCount = menuList.querySelectorAll("li").length;
  menuCountText.textContent = `총 ${menuCount}개`;
};

// 렌더
function paintMenu() {
  menuList.innerHTML = "";
  menu[currentCategory].map((item, index) => {
    const template = `
      <li data-menu-id=${
        item.id
      } class="menu-list-item d-flex items-center py-2">
        <span class="${
          item.isSoldOut ? "sold-out" : ""
        } w-100 pl-2 menu-name">${item.name}</span>
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
async function handleAddSubmit(e) {
  e.preventDefault();
  const newAdd = menuInput.value;
  console.log(menu[currentCategory]);

  await MenuApi.createMenu(currentCategory, newAdd);
  menu[currentCategory] = await MenuApi.getAllMenuByCategory(currentCategory);
  console.log(menu[currentCategory]);
  paintMenu();
  menuInput.value = "";
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
    LocalStorageSet();
    paintMenu();
  }
}

// 메뉴 수정
const updateMenuName = async (e) => {
  const menuId = e.target.closest("li").dataset.menuId;

  if (e.target.classList.contains("menu-edit-button")) {
    const value = prompt("메뉴명을 수정하세요", "");
    if (value.replace(" ", "").length === 0) {
      alert("메뉴 이름을 입력해주세요.");
      return;
    } else {
      e.target.closest("li").querySelector(".menu-name").textContent = value;

      // menu[currentCategory][menuId] = value;
      // LocalStorageSet();
    }
    await MenuApi.updateMenu(currentCategory, value, menuId);
    menu[currentCategory] = await MenuApi.getAllMenuByCategory(currentCategory);
    console.log(menu[currentCategory]);
  }
};

// 메뉴 삭제
const removeMenuName = async (e) => {
  const menuId = e.target.closest("li").dataset.menuId;

  if (e.target.classList.contains("menu-remove-button")) {
    if (confirm("이 메뉴를 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      await MenuApi.deleteMenu(currentCategory, menuId);
      menu[currentCategory] = await MenuApi.getAllMenuByCategory(
        currentCategory
      );
      // menu[currentCategory].splice(menuId, 1);
      // LocalStorageSet();
      paintMenu();
    }
  }
};

// 품절
const soldOutMenu = async (e) => {
  if (e.target.classList.contains("menu-sold-out-button")) {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(currentCategory, menuId);
    menu[currentCategory] = await MenuApi.getAllMenuByCategory(currentCategory);
    // menu[currentCategory][menuId].soldOut =
    //   !menu[currentCategory][menuId].soldOut;
    // LocalStorageSet();
    console.log(menu[currentCategory]);
    paintMenu();
  }
};

// 카테고리명 출력
const handleNav = async (e) => {
  const isCategoryButton = e.target.classList.contains("cafe-category-name");
  if (isCategoryButton) {
    currentCategory = e.target.dataset.categoryName;
    document.querySelector(
      "#category-name"
    ).textContent = `${e.target.textContent} 메뉴 관리`;
    menu[currentCategory] = await MenuApi.getAllMenuByCategory(currentCategory);
    paintMenu();
  }
};

nav.addEventListener("click", handleNav);
menuForm.addEventListener("submit", handleAddSubmit);
menuList.addEventListener("click", soldOutMenu);
menuList.addEventListener("click", updateMenuName);
menuList.addEventListener("click", removeMenuName);
menuSubmitBtn.addEventListener("click", handleAddSubmitBtn);

if (LocalStorageGet !== null) {
  menu = LocalStorageGet;
  paintMenu();
}
