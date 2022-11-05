const menuForm = document.getElementById("espresso-menu-form");
const menuInput = document.querySelector("#espresso-menu-form input");
const menuList = document.getElementById("espresso-menu-list");
const menuCountText = document.querySelector(".menu-count");
const menuSubmitBtn = document.querySelector("#espresso-menu-submit-button");

const MENUSAVED_KEY = "menuSaved";

let menuSaved = [];

function saveMenus() {
  localStorage.setItem(MENUSAVED_KEY, JSON.stringify(menuSaved));
}
const savedMenuSaved = localStorage.getItem(MENUSAVED_KEY);

const menuCount = () => {
  const menuCount = menuList.querySelectorAll("li").length;
  menuCountText.textContent = `총 ${menuCount}개`;
};

function paintMenu(newAdd, index) {
  const buttonText = `
    <li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${newAdd}</span>
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
  menuList.insertAdjacentHTML("beforeend", buttonText);
  menuCount();
}

function handleAddSubmit(e) {
  e.preventDefault();
  const newAdd = menuInput.value;
  menuInput.value = "";
  menuSaved.push(newAdd);
  saveMenus();
  menuList.innerHTML = "";
  menuSaved.forEach((menu, index) => {
    paintMenu(menu, index);
  });
}

function handleMenuSubmitBtn(e) {
  e.preventDefault();
  const newAdd = menuInput.value;
  menuInput.value = "";
  if (newAdd === "") {
    alert("메뉴 이름을 입력해주세요.");
  } else {
    menuSaved.push(newAdd);
    saveMenus();
    menuList.innerHTML = "";
    menuSaved.forEach((menu, index) => {
      paintMenu(menu, index);
    });
  }
}

const handleMenuList = function (e) {
  const menuId = e.target.closest("li").dataset.menuId;
  if (e.target.classList.contains("menu-edit-button")) {
    const value = prompt("수정 값을 입력하세요", "");
    if (value.replace(" ", "").length === 0) {
      alert("메뉴 이름을 입력해주세요.");
      return;
    } else {
      e.target.closest("li").querySelector(".menu-name").textContent = value;
      menuSaved[menuId] = value;
      saveMenus();
    }
  }

  if (e.target.classList.contains("menu-remove-button")) {
    if (confirm("이 메뉴를 삭제하시겠습니까?")) {
      e.target.closest("li").remove();

      const menuId = e.target.closest("li").dataset.menuId;
      menuSaved.splice(menuId, 1);
      saveMenus();
      menuSaved.forEach((menu, index) => {
        paintMenu(menu, index);
      });

      menuCount();
    }
  }
};

menuForm.addEventListener("submit", handleAddSubmit);
menuList.addEventListener("click", handleMenuList);
menuSubmitBtn.addEventListener("click", handleMenuSubmitBtn);

if (savedMenuSaved !== null) {
  const parsedMenuSaved = JSON.parse(savedMenuSaved);
  menuSaved = parsedMenuSaved;
  parsedMenuSaved.forEach((newAdd, index) => {
    paintMenu(newAdd, index);
  });
}
