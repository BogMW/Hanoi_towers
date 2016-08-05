$(document).ready(function(){

    var towerWrap = $('.tower-wrap');
    var towerWrapWidth = towerWrap.outerWidth();
    var towerWrapHeight = towerWrap.outerHeight();
    var counter = 0;
    var countDisc = 0;
    var story = [];


    if(localStorage.getItem('story') !== null ) {
        alert('З поверненням Вас');
        counter = localStorage.getItem('counter');
        countDisc = localStorage.getItem('countDisc');
        $('#counter').text(counter);
        for(var i = 1; i <= countDisc; i++){
            $('.start-tower').append('<div class="disc disc-' + i + '" data-disc-num="' + i + '"></div>');
            if(i == countDisc){
                towerWrap.append('<div class="tower"></div>');
            }
        }
        story = JSON.parse(localStorage.getItem('story'));
        function backToGame(count){
            var discForMove =  $('.disc[data-disc-num = ' + story[count][2] + ']');
            discForMove.remove();
            $('.tower-wrap[data-tow-num = ' + story[count][1] + ']').prepend(discForMove);
        }

        var playIntID;
        var count = 0;
        playIntID = setInterval(function () {
            if(!(count >= story.length)){
                backToGame(count);
                count++;
            }else{
                clearInterval(playIntID);
            }
        }, 4);
    }


    
    //Генеруємо вказану кількість дисків та очищаємо історію
    var newGameButton = $('.new-game');
    newGameButton.on('click', function () {
        localStorage.clear();
        $('.play-game').prop('disabled', true);
        $('.back').prop('disabled', false);
        $('.forward').prop('disabled', false);
        countDisc = $('#input').val();

        if(countDisc >= 3 && countDisc <= 8){
            $('.tower').remove();
            $('.disc').remove();
            story.splice(0, story.length);
            counter = 0;
            $('#counter').text(counter);
            for(i = 1; i <= countDisc; i++){
                $('.start-tower').append('<div class="disc disc-' + i + '" data-disc-num="' + i + '"></div>');
                if(i == countDisc){
                    towerWrap.append('<div class="tower"></div>');
                }
            }
            localStorage.setItem('countDisc', countDisc);
        }else{
            alert('Введіть число від 3 до 8');
        }
    });

    //ДрагНдроп
    towerWrap.on('mousedown', '.disc', function (event) {
        if(event.which == 1) {

            offDefaultDragNDrop();

            var _this = $(this);
            var startPosX = event.pageX;
            var startPosY = event.pageY;
            var currentPosX,
                currentPosY;

            _this.parent().addClass('current-tower');

            if(_this.is('.disc:first-child')){
                $(window).mousemove(function (event) {
                    currentPosX = event.pageX;
                    currentPosY = event.pageY;
                    var moveX = currentPosX - startPosX;
                    var moveY = currentPosY - startPosY;

                    for(i=0; i < towerWrap.length; i++){
                        if((currentPosX >= towerWrap.eq(i).offset().left && currentPosX <= (towerWrap.eq(i).offset().left + towerWrapWidth)) && (currentPosY >= towerWrap.eq(i).offset().top && currentPosY <= (towerWrap.eq(i).offset().top + towerWrapHeight))){
                            towerWrap.removeClass('current-tower');
                            towerWrap.eq(i).addClass('current-tower');
                            break;
                        }else{
                            towerWrap.removeClass('current-tower');
                            _this.parent().addClass('current-tower');
                        }
                    }
                    _this.css('transform', 'translate(' + moveX + 'px, ' + moveY + 'px)');
                });

                $(window).mouseup(function () {

                    function move () {
                        if(story.length > counter){
                            story.splice(counter, story.length - counter);
                        }
                        story.push([_this.parent().data('towNum'), $('.current-tower').data('towNum'),_this.data('discNum')]);
                        _this.remove();
                        _this.css('transform', 'translate(0px, 0px)');
                        $('.current-tower').prepend(_this);
                        towerWrap.removeClass('current-tower');
                        counter++;
                        localStorage.setItem('counter', counter);
                        $('#counter').text(counter);
                    }

                    if(!(_this.parent().hasClass('current-tower'))){
                        if($('.current-tower .disc:first').position()){
                            if(!(_this.data('discNum') > $('.current-tower .disc:first').data('discNum'))){
                               move();
                            }else{
                                alert('А нізя!');
                                _this.css('transform', 'translate(0px, 0px)');
                            }
                        }else{
                           move();
                        }
                    }else{
                        _this.css('transform', 'translate(0px, 0px)');
                        towerWrap.removeClass('current-tower');
                    }

                    $(window).off('mousemove');
                    $(window).off('mouseup');
                    localStorage.setItem('story', JSON.stringify(story));
                    console.dir(JSON.parse(localStorage.getItem('story')));
                    checkCondition();
                });
            } else {
                alert('Упсс');
            }
        }
    });
    
    //функція відключення дефолтного Drag'n'Drop браузера
    function offDefaultDragNDrop () {  
        $(window).on('dragstart', function () {
            return false;
        });
    }

    //назад в минуле
    $('.back').on('click', function () {
        if(!counter <= 0){
            var storyDisc =  $('.disc[data-disc-num = ' + story[counter - 1][2] + ']');
            storyDisc.remove();
            $('.tower-wrap[data-tow-num = ' + story[counter - 1][0] + ']').prepend(storyDisc);

            counter--;
            $('#counter').text(counter);
        }else{
            alert('Назад більше нема');
        }
    });

    //вперед в майбутнє
    $('.forward').on('click', function () {
        if(!story.length == 0 && counter < story.length){
            var storyDisc =  $('.disc[data-disc-num = ' + story[counter][2] + ']');
            storyDisc.remove();
            $('.tower-wrap[data-tow-num = ' + story[counter][1] + ']').prepend(storyDisc);

            counter++;
            $('#counter').text(counter);
        }else{
            alert('Вперед більше нема');
        }
    });

    //перевірка на виконання умов гри
    function checkCondition() {
        for (i = 0; i < towerWrap.length; i++){
            if(!towerWrap.eq(i).hasClass('start-tower')){
                if(towerWrap.eq(i).find('.disc').length == countDisc){
                    alert('Вітаємо, ви закінчили гру за ' + counter + ' кроків');
                    $('.play-game').prop('disabled', false);
                    $('.back').prop('disabled', true);
                    $('.forward').prop('disabled', true);
                }
            }
        }
    }

    $('.play-game').on('click', function () {
        $('.tower').remove();
        $('.disc').remove();
        for(var i = 1; i <= countDisc; i++){
            $('.start-tower').append('<div class="disc disc-' + i + '" data-disc-num="' + i + '"></div>');
            if(i == countDisc){
                towerWrap.append('<div class="tower"></div>');
            }
        }

        function playStory(count){
            var discForMove =  $('.disc[data-disc-num = ' + story[count][2] + ']');
            discForMove.remove();
            $('.tower-wrap[data-tow-num = ' + story[count][1] + ']').prepend(discForMove);
        }

        var playIntID;
        var count = 0;
        playIntID = setInterval(function () {
            if(!(count >= story.length)){
                playStory(count);
                count++;
            }else{
                clearInterval(playIntID);
            }
        }, 500);
        setTimeout(function(){
            alert('Розпочніть нову гру');
            newGameButton.click();
        },500*counter+200);
    });
});