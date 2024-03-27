
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
    setup(editor) {
      editor.on('change', () => {
        editor.save()
      })
    }
  });