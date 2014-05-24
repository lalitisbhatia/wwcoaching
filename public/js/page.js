
// Next Button Click
$("#next").click(function() {

  var crnt_sec = $(this).parent(),
      next_sec = $(this).parent().next(),
      firstName = $('[name="First Name"]').val(),
      lastName = $('[name="Last Name"]').val();

  if ($('[name="First Name"]').val().length == 0 || $('[name="Last Name"]').val().length == 0) {
    $('.name').addClass('error');
    $('.aq-ww-banner').addClass('totop');
  } else {

    $('.name').removeClass('error');
    $('.users-name').text(firstName+' '+lastName);
    $('.aq-ww-banner').addClass('totop');

    crnt_sec.fadeOut(400, function() {
      $(this).removeClass('active');
      setTimeout(function() {
        $('.btwn-msg').fadeIn(500, function() {
          $(this).delay(1000).fadeOut(500, function() {
            next_sec.fadeIn(500).addClass('active');
            $('.aq-ww-banner').removeClass('totop');
          });
        });
      }, 200);
    });

  }
});

$('[name="food_type"]').keyup(function() {
  this.value = this.value.replace(/[^0-9\.]/g,'');
});

// $('.select label').click(function() {
//   console.log('label clicked!');
//   return false;
//   $(this).find('select').trigger('click');
//   console.log('select triggered!');
// });


$(document).ready(function() {

  // check if device is iPhone, iPod or iPad
  if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
    // send header to top (position: absolute) if an input, textarea or select has focus
    $('input, textarea, select').focus(function() {
      $('.aq-ww-banner').addClass('totop');
    // return to fixed position when field is blured
    }).blur(function() {
      $('.aq-ww-banner').removeClass('totop');
    })
    // check if iOS version is <= 5
    if (/OS [1-5](.*) like Mac OS X/i.test(navigator.userAgent)) {
      // allow focusing on labels in these version of ios
      $('label').attr('onClick', '');
    }
  }

  // Placeholder fix for non-supporting browsers
  // $('[placeholder]').focus(function() {
  //   var input = $(this);
  //   if (input.val() == input.attr('placeholder')) {
  //     input.val('');
  //     input.removeClass('placeholder');
  //   }
  // }).blur(function() {
  //   var input = $(this);
  //   if (input.val() == '' || input.val() == input.attr('placeholder')) {
  //     input.addClass('placeholder');
  //     input.val(input.attr('placeholder'));
  //   }
  // }).blur();

  // remove widows
  // $(".ans-box span, .qstn").each(function() {
  //   var wordArray = $(this).text().split(" ");
  //   if (wordArray.length > 1) {
  //     wordArray[wordArray.length-2] += "&nbsp;" + wordArray[wordArray.length-1];
  //     wordArray.pop();
  //     $(this).html(wordArray.join(" "));
  //   }
  // });

  // adding a class of 'checked' when radio button is selected
  $('input[type="radio"]').change(function() {
    $(this).parents('fieldset').find('label').removeClass('checked');
    if ($(this).prop('checked')) {
      $(this).parent('label').addClass('checked');
    }
  });

  // adding a class of 'checked' when checkbox is selected
  $('input[type="checkbox"]').change(function() {
    if ($(this).prop('checked')) {
      $(this).parent('label').addClass('checked');
    } else {
      $(this).parent('label').removeClass('checked');
    }
  });

  // displaying hidden text input or textarea when radio button with a class of 'other' is selected
  $(".qstn-wrap").change(function() {
    var input = $(this).find('input[type="radio"]:checked');
    var otherInput = $(this).find('input[type="radio"].other').parents('fieldset').find('.other-input');

    if (input.attr('class') == 'other') {
      otherInput.fadeIn();
    } else {
      otherInput.fadeOut();
    }
  });

  // displaying hidden text input or textarea when checkbox with a class of 'other' is selected
  $('input.other').change(function() {
    var otherInput = $(this).parent('label').next('.other-input');

    if ($(this).prop('checked')) {
      otherInput.fadeIn();
    } else {
      otherInput.fadeOut();
    }
  });

  // Show/hide the Devices section
  $("input[name='act_track']").change(function () {
    var actTrackChecked = $("input[name='act_track']:checked");
    if (actTrackChecked.prop("id") == "yesDevices") {
      $(".devices").fadeIn();
    } else {
      $(".devices").fadeOut();
    }
  });
  
  $("input[type='checkbox'][data-limit]").change(function() {
    var name = $(this).attr('name');
    var input = $("input[type='checkbox'][data-limit][name="+name+"]:checked");
    var length = input.length;
    var dataLimit = $("input[type='checkbox'][name="+name+"]").attr('data-limit');

    if (length == dataLimit) {
      $("input[type='checkbox'][data-limit][name="+name+"]:not(:checked)").attr('disabled', true);
    } else {
      $("input[type='checkbox'][data-limit][name="+name+"]:not(:checked)").attr('disabled', false);
    }
  });

});