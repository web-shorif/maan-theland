;(function($) {
    "use strict"; 
    AOS.init({
        duration: 1000,

    }); 

    // nice Selector 
    $(document).ready(function() {
        $('select').niceSelect();
    });

    //* Navbar Fixed  
    function navbarFixed(){
        if ( $('.fast-header-area').length ){ 
            $(window).on('scroll', function() {
                var scroll = $(window).scrollTop();   
                if (scroll >=90) {
                    $(".fast-header-area").addClass("navbar-fixed").fadeIn();
                } else {
                    $(".fast-header-area").removeClass("navbar-fixed");
                }
            });
        };
    }; 

    // Mobile menu/
    $("#menu-opener").on('click', function () {
        $(".mobile-menu").toggleClass("active");
    });
    $(".remove-one").on('click', function () {
        $(".mobile-menu").removeClass("active");
    });  
    if($('.mobile-menu li.dropdown ul').length){
        $('.mobile-menu li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>');
        $('.mobile-menu li.dropdown .dropdown-btn').on('click', function() {
            $(this).prev('ul').slideToggle(500);
        });
    } 

    // Scroll to top
    function scrollToTop() {
        if ($('.back-to-top').length) {  
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > 100) {
                    $('.back-to-top').fadeIn();
                } else {
                    $('.back-to-top').fadeOut();
                }
            }); 
            //Click event to scroll to top
            $('.back-to-top').on('click', function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 100);
                return false;
            });
        }
    } 

    // background-image
    function bgImg() {
        $("[data-background]").each(function() {
            $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
        });
    }

    // niceSelect
    $.fn.niceSelect = function(method) {
        
        // Methods
        if (typeof method == 'string') {      
        if (method == 'update') {
            this.each(function() {
            var $select = $(this);
            var $dropdown = $(this).next('.nice-select');
            var open = $dropdown.hasClass('open');
            
            if ($dropdown.length) {
                $dropdown.remove();
                create_nice_select($select);
                
                if (open) {
                $select.next().trigger('click');
                }
            }
            });
        } else if (method == 'destroy') {
            this.each(function() {
            var $select = $(this);
            var $dropdown = $(this).next('.nice-select');
            
            if ($dropdown.length) {
                $dropdown.remove();
                $select.css('display', '');
            }
            });
            if ($('.nice-select').length == 0) {
            $(document).off('.nice_select');
            }
        } else {
            console.log('Method "' + method + '" does not exist.')
        }
        return this;
        }
        
        // Hide native select
        this.hide();
        
        // Create custom markup
        this.each(function() {
        var $select = $(this);
        
        if (!$select.next().hasClass('nice-select')) {
            create_nice_select($select);
        }
        });
        
        function create_nice_select($select) {
        $select.after($('<div></div>')
            .addClass('nice-select')
            .addClass($select.attr('class') || '')
            .addClass($select.attr('disabled') ? 'disabled' : '')
            .attr('tabindex', $select.attr('disabled') ? null : '0')
            .html('<span class="current"></span><ul class="list"></ul>')
        );
            
        var $dropdown = $select.next();
        var $options = $select.find('option');
        var $selected = $select.find('option:selected');
        
        $dropdown.find('.current').html($selected.data('display') || $selected.text());
        
        $options.each(function(i) {
            var $option = $(this);
            var display = $option.data('display');
    
            $dropdown.find('ul').append($('<li></li>')
            .attr('data-value', $option.val())
            .attr('data-display', (display || null))
            .addClass('option' +
                ($option.is(':selected') ? ' selected' : '') +
                ($option.is(':disabled') ? ' disabled' : ''))
            .html($option.text())
            );
        });
        }
        
        /* Event listeners */
        
        // Unbind existing events in case that the plugin has been initialized before
        $(document).off('.nice_select');
        
        // Open/close
        $(document).on('click.nice_select', '.nice-select', function(event) {
        var $dropdown = $(this);
        
        $('.nice-select').not($dropdown).removeClass('open');
        $dropdown.toggleClass('open');
        
        if ($dropdown.hasClass('open')) {
            $dropdown.find('.option');  
            $dropdown.find('.focus').removeClass('focus');
            $dropdown.find('.selected').addClass('focus');
        } else {
            $dropdown.focus();
        }
        });
        
        // Close when clicking outside
        $(document).on('click.nice_select', function(event) {
        if ($(event.target).closest('.nice-select').length === 0) {
            $('.nice-select').removeClass('open').find('.option');  
        }
        });
        
        // Option click
        $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
        var $option = $(this);
        var $dropdown = $option.closest('.nice-select');
        
        $dropdown.find('.selected').removeClass('selected');
        $option.addClass('selected');
        
        var text = $option.data('display') || $option.text();
        $dropdown.find('.current').text(text);
        
        $dropdown.prev('select').val($option.data('value')).trigger('change');
        });
    
        // Keyboard events
        $(document).on('keydown.nice_select', '.nice-select', function(event) {    
        var $dropdown = $(this);
        var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));
        
        // Space or Enter
        if (event.keyCode == 32 || event.keyCode == 13) {
            if ($dropdown.hasClass('open')) {
            $focused_option.trigger('click');
            } else {
            $dropdown.trigger('click');
            }
            return false;
        // Down
        } else if (event.keyCode == 40) {
            if (!$dropdown.hasClass('open')) {
            $dropdown.trigger('click');
            } else {
            var $next = $focused_option.nextAll('.option:not(.disabled)').first();
            if ($next.length > 0) {
                $dropdown.find('.focus').removeClass('focus');
                $next.addClass('focus');
            }
            }
            return false;
        // Up
        } else if (event.keyCode == 38) {
            if (!$dropdown.hasClass('open')) {
            $dropdown.trigger('click');
            } else {
            var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
            if ($prev.length > 0) {
                $dropdown.find('.focus').removeClass('focus');
                $prev.addClass('focus');
            }
            }
            return false;
        // Esc
        } else if (event.keyCode == 27) {
            if ($dropdown.hasClass('open')) {
            $dropdown.trigger('click');
            }
        // Tab
        } else if (event.keyCode == 9) {
            if ($dropdown.hasClass('open')) {
            return false;
            }
        }
        });
    
        // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        if (style.pointerEvents !== 'auto') {
        $('html').addClass('no-csspointerevents');
        }
        
        return this;
    
    }; 
        $(document).ready(function() {
        $('select').niceSelect();
    });

    // Store of the Month
    var swiper = new Swiper(".added-properties",{ 
        slidesPerView: 3,
        spaceBetween: 30, 
        autoplay: true,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        speed: 1000,
        autoplay:{
            delay:5000,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: {
              slidesPerView: 1, 
            }, 
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
        },
    }); 

    // home page proprety-seler 
    var swiper = new Swiper(".proprety-sele", { 
        slidesPerView: 4,
        spaceBetween: 30, 
        autoplay: true,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true, 
        speed: 1400,   
        autoplay:{
            delay:6000,   
        },
        navigation: {
            nextEl: ".sale-next",
            prevEl: ".sale-prev",
        },
        breakpoints: {
            0: {
              slidesPerView: 1, 
            },
             
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1600: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
        },
    });  

    // home page proprety-rent
    var swiper = new Swiper(".proprety-rent", { 
        slidesPerView: 4,
        spaceBetween: 30, 
        autoplay: true,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        speed: 1000,
        autoplay:{
            delay:6000,
        },
        navigation: {
            nextEl: ".rent-next",
            prevEl: ".rent-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1, 
            },
            
            768: {
            slidesPerView: 2,
            spaceBetween: 20,
            },
            1024: {
            slidesPerView: 3,
            spaceBetween: 25,
            },
            1600: {
            slidesPerView: 4,
            spaceBetween: 25,
            },
        },
    }); 

    //*about page counter-up.js/ 
    function counterUp() {
        if ($('.counter-up-item').length) { 
            $('.counter').counterUp({
                delay: 10,
                time: 2000, 
            });
        };
    }; 

    // about page claint sey swiper 
    var swiper = new Swiper(".clients-rating", {
        slidesPerView: 1,   
        speed: 1000,
        autoplay:{
            delay:6000,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
    });

    // about page trusted-claints slider 
    var swiper = new Swiper(".trusted-claint", { 
        slidesPerView: 6,  
        autoplay: true,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        speed: 5000,
        autoplay:{
            delay: 0,
        }, 
        breakpoints: {
            0: {
              slidesPerView: 2, 
            },
            440: {
              slidesPerView: 3, 
            },
            570: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 25,
            },
        },
    });

    // property-details-slider area  
    var swiper = new Swiper(".product-small", {
        loop: true, 
        spaceBetween: 30,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true, 
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        }, 
        breakpoints: {
            0: {
                slidesPerView: 1, 
                spaceBetween: 0,
            },
            360: {
                slidesPerView: 2, 
                spaceBetween: 10,
            }, 
            570: {
                slidesPerView: 2,
                spaceBetween: 20, 
            }, 
            768: {
                slidesPerView: 3,
                spaceBetween: 30, 
            }, 
            1200: {
                slidesPerView: 4, 
                spaceBetween: 30,
            },
        },
    });
    var swiper2 = new Swiper(".product-bibs", {
        loop: true,
        spaceBetween: 30,
        slidesPerView: 1, 
        thumbs: {
            swiper: swiper,
        }, 
    }); 

    //* Magnificpopup js
    function magnificPopup() {
        if ($('.popup-youtube, .p-r-youtube').length) { 
            //Video Popup
            $('.popup-youtube, .p-r-youtube').magnificPopup({
                disableOn: 200,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false, 
                fixedContentPos: false,
            });   
        };
    };

    // Related Properties Nearby 
    var swiper = new Swiper(".nropertiesNearby", {
        slidesPerView: "auto",
        spaceBetween: 30,
        slidesPerView: 2.5,
        slidesPerGroup: 1,
        loop: true,
        autoplay: true,
        loopFillGroupWithBlank: true,
        speed: 5000,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
            0: {
              slidesPerView: 1, 
              spaceBetween: 10,
            }, 
            768: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 1.9,
              spaceBetween: 25,
            },
            1440: {
              slidesPerView: 2.5,
              spaceBetween: 25,
            },
        },
    });
    
    // property-list-position-demo
    $('.property-list-position-demo').easyTicker(); 
       
    /*Function Calls*/  
    scrollToTop();
    navbarFixed ();   
    bgImg();  
    counterUp();
    magnificPopup();   
    
})(jQuery);