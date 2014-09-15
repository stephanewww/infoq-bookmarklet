// Injecter automatiquement la source
// FIXME : image avec un click to enlarge semble buggée. Voir le dom associé.

(function () {
  "use strict";
        if (document.URL.indexOf('www.infoq.com/') !== -1 || window.location.href.indexOf('www.infoq.com/') !== -1) {
            execute();
        } else {
            alert('This bookmarklet only works on infoQ pages.')
        }

        function execute() {

            var templates = {
                news: "\n* Title: ${title}\n* Translator:\n* Topics: ${topics}\n* Summary (max 400 chars): ${summary}\n\n---------------------------------------\n\n",
                article: "\n* Title: ${title}\n* Translator:\n* Topics: ${topics}\n* Short Summary (200 chars max): ${summaryShort}\n* Summary (max 400 chars) : ${summary}\n\n---------------------------------------\n\n"
            };

            if (!($ = window.jQuery)) {
                var jqScript = document.createElement('script');
                jqScript.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
                jqScript.onload = loadJQui;
                document.body.appendChild(jqScript);
            }
            else {
                loadJQui();
            }

            function loadJQui() {
                if (!(window.jQuery.ui)) {
                    var jquiScript = document.createElement('script');
                    jquiScript.src = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js';
                    jquiScript.onload = loadMarkdownLib;
                    document.body.appendChild(jquiScript);

                    var fileref = document.createElement("link");
                    fileref.setAttribute("rel", "stylesheet");
                    fileref.setAttribute("type", "text/css");
                    fileref.setAttribute("href", 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/vader/jquery-ui.css');
                    document.getElementsByTagName("head")[0].appendChild(fileref)
                }
                else {
                    loadMarkdownLib();
                }
            }

            function loadMarkdownLib() {

                if (typeof h2m === 'undefined') {
                    var script = document.createElement('script');
                    script.src = 'https://raw.githubusercontent.com/mathiasbynens/he/master/he.js';
                    document.body.appendChild(script);

                  var script2 = document.createElement('script');
                    script2.src = 'https://raw.githubusercontent.com/domchristie/to-markdown/master/src/to-markdown.js';
                    script2.onload = offWeGo;
                    document.body.appendChild(script2);
                } else {
                    offWeGo();
                }
            }

            function offWeGo() {
                var mdCopyPaste = $('<div id="markdownRendered"><textarea id="mdToCopy" cols="80" rows="40" style="display: block; margin: auto; padding: 10px;"></textarea></div>');
                mdCopyPaste.appendTo('body');

                var $markdownRendered = $('#markdownRendered');
                $markdownRendered.dialog({height: 600, width: 1000, modal: true});
                var textarea = $('#mdToCopy');

                textarea.val('Converting...');

                var htmlToParse = $('.text_content_container>.text_info').clone();
                htmlToParse = htmlToParse.find('.related_sponsors').remove().end()
                    .find('.clear').remove().end()
                    .find('#lowerFullwidthVCR').remove().end().html();

                htmlToParse = htmlToParse.replace(/img(.*?)src="(\/resource\/)/g, 'img$1src="http://www.infoq.com$2');

                var template = "";
                if(document.URL.indexOf('www.infoq.com/news')!==-1){
                    template = templates.news;
                } else if(document.URL.indexOf('www.infoq.com/article')!==-1){
                    template = templates.news;
                }

                var topics = [];
                $('.random_links ul li').each(function(idx, ele){ topics.push($(ele).text()); });
                topics = topics.slice(topics.indexOf('Topics') + 1);

                var value = template
                    .replace(/\$\{title\}/g, document.title)
                    .replace(/\$\{topics\}/g, '\n    - ' + topics.join('\n    - ') + '\n')
                    .replace(/\$\{summary\}/g, $('meta[name=description]').attr("content"));

                value += toMarkdown(htmlToParse.split('<div class="random_links">')[0]);


                textarea.val(value);
            }


        }
    })();