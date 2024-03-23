let header = document.querySelector("header");
const imageManageAccount = document.getElementsByClassName("avt-account")[0];
const showManageAccount = document.getElementsByClassName("account-manage")[0];

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});

imageManageAccount.addEventListener("click", () => {
  showManageAccount.classList.toggle("show");
});

tinymce.init({
  selector: "textarea#default",
  license_key: 'gpl',
  height: 600,
  plugins: [
    "advlist",
    "autolink",
    "link",
    "image",
    "lists",
    "charmap",
    "preview",
    "anchor",
    "pagebreak",
    "searchreplace",
    "wordcount",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "emoticons",
    "codesample",
  ],
  toolbar:
    "undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |" +
    "bullist numlist outdent indent | link image | print preview media fullscreen | " +
    "forecolor backcolor emoticons",
  menu: {
    favs: {
      title: "menu",
      items: "code visualaid | searchreplace | emoticons",
    },
  },
  menubar: "favs file edit view insert format tools table",
  content_style: "body{font-family:Helvetica,Arial,sans-serif; font-size:16px}",
});
