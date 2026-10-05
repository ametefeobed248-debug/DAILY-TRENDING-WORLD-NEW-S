card
    .querySelector(".read-story")
    .addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            localStorage.setItem(
                "worldPulseArticle",
                JSON.stringify(article)
            );

            window.location.href =
                "article.html";

        }
    );