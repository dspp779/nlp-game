/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

questions = [{
    'question': 'However, my class and I have seen an advertisement _ a fashion and leisure show.',
    'options': ['about', 'of', 'on', 'for'],
    'answer': 'for'
}, {'question': 'Nowadays the main attraction in the newspapers and _ television is the private lives of famous people.',
    'options': ['on', 'to', 'of', 'for'],
    'answer': 'on'
}, {'question': 'At the end we could have a comment _ each student in our class.',
    'options': ['in', 'of', 'to', 'from'],
    'answer': 'from'
}];
user_anwsers = [];
comments = ['拜託，連我阿嬤都比你厲害', '加油，好嗎？(1/3)', '你還有得學呢！(2/3)', '太神啦！'];

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

function init() {
    
}

function start_maze() {
    setModal('<iframe src="/static/maze/index.html" style="height:500px;width:480px;"></iframe>');
}

function start_race() {
    setModal('<iframe src="/static/race/index.html" style="height:480px;width:600px;"></iframe>');
}

function setModal(content) {
    $('div#myModal').html(content+'<h6 class="exit-hint">按下其他地方離開遊戲</h6>');
}