$('.taphover').on("touchstart", function (e) {
  "use strict"; //satisfy the code inspectors
  var link = $(this); //preselect the link
  if (link.hasClass('hover')) {
    return true;
  } else {
    link.addClass("hover");
    $('.taphover').not(this).removeClass("hover");
    e.preventDefault();
    return false; //extra, and to make sure the function has consistent return points
  }
});

/**
 * Name: openModal
 * Param: docid - id of modal to open
 * Return: false
 * Details: Open a specified modal
 */
function openModal(docid) {
  $(docid).addClass('modal-opened');
  return false;
}

/**
 * Name: closeModal
 * Param: docid - id of modal to close
 * Return: false
 * Details: Closes a specified modal
 */
function closeModal(docid) {
  $(docid).removeClass('modal-opened');
  return false;
}

/**
 * Name: addToList
 * Param: listid - The parent list to which to append list item
 *        newItem - The new item to add to the appendable list
 * Return: undefined
 * Details: Adds an appendable list element to a parent list specified by id (listid)
 */
function addToList(listid, newItem) {
  var itemname = $(newItem).val();
  var re = new RegExp(/(\w+( +\w+)*): (\w+( +\w+)*)/);
  if(itemname.length == 0) {
    alert('Field must be non-empty.');
  } else if(!re.test(itemname)) {
      alert('Item needs to be in the form of: \'Item: Quantity\'.\nExample: \'Water: 1 tsp.\'');
  } else {
    $(listid).append(getEditLi($(newItem).val()));
    $(newItem).val('');
  }
}

/**
 * Name: getEditLi
 * Param: newItemVal - text value to input into this list element
 * Return: Return the text of the html of the appendable list element
 * Details: Constructs an appendable list element containing the text of the new item
 */
function getEditLi(newItemVal) {
  var toRet = '<li class="taphover">\n'
            +   '<span class="itemli">'
            +     newItemVal
            +   '</span>\n'
            +   '<button class="btnDelete" onclick="removeItem(this);" type="button">\n'
            +     '<img alt="btnDel" src="resources/icons/glyphicons-208-remove.png" />\n'
            +   '</button>\n'
            +   '<button class="btnEdit" onclick="editItem(this);" type="button">\n'
            +     '<img alt="btnEd" src="resources/icons/glyphicons-151-edit.png" />\n'
            +   '</button>\n'
            +	 '<input class="mt10 input2 hide" type="text" placeholder="New Ingredient" />\n'
            + '</li>\n';
  return toRet;
}

/**
 * Name: removeItem
 * Param: item
 * Return: undefined
 * Details: Deletes the appendable list item after user confirm
 */
function removeItem(item) {
  if(confirm("Are you sure you want to delete this item?")) {
    $(item).closest('li').remove();
  }
}

/**
 * Name: editItem
 * Params: item
 * Return: false
 * Details: Provide input buttons and fields to allow editting appendable list items
 */
function editItem(item) {
  var re = new RegExp(/(\w+( +\w+)*): (\w+( +\w+)*)/);
  var itemEntry = $(item).next();
  itemEntry.removeClass('hide');
  itemEntry.select();
  itemEntry.parent().removeClass('taphover');
  itemEntry.on('keyup, keypress, keydown', function(e) {
    var keyCode = e.keyCode || e.which;
    if(keyCode === 13) {
      e.preventDefault();
      if($(item).parent().children().last().val().length == 0) {
        alert('Field must be non-empty.');
      } else if(!re.test(itemEntry.val())) {
        alert('Item needs to be in the form of: \'Item: Quantity\'.\nExample: \'Water: 1 tsp.\'');
      } else {
        itemEntry.addClass('hide');
        var span = itemEntry.parent().find('span').first();
        var btns = itemEntry.parent().find('button');
        var btn1 = btns.first();
        var btn2 = btns.first().next();
        span.text(itemEntry.val());
        span.addClass('showBlock');
        btn1.addClass('hide');
        btn2.addClass('hide');
        span.hover(function() {
          itemEntry.parent().addClass('taphover');
          span.removeClass('showBlock');
          btn1.removeClass('hide');
          btn2.removeClass('hide');
          span.unbind('mouseenter mouseleave');
        });
      }
      return false;
    }
  });
  return false; // to prevent page refresh on submit
}

// value of file upload input changed -> readURL and update with image
$(function() {
  $('#fileBtn').change(function () {
    readURL(this);
  });
});

/**
 * Name: readURL
 * Params: input - upload input for which the img url is to be read
 * Return: undefined
 * Details: Reads the value of an upload input and updates the page with a fitted image of
 *          the drink image that was uploaded
 */
function readURL(input) {
  var valFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
  if(input.files && input.files[0]) {
    var ext = input.files[0].name.split('.').pop().toLowerCase();
    if(!(valFileTypes.indexOf(ext) > -1)) {
      alert('File must be a supported image file type.');
      input.value = null;
      $('#drinkImg').remove();
    } else {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('#drinkImg').remove();
        var newimg = document.createElement('img');
        newimg.setAttribute('id', 'drinkImg');
        $(newimg).css({
          'width': '100%',
          'height': '100%'
        });
        newimg.src = e.target.result;
        $('#cocktailPic').append(newimg);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
}
