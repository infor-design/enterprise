/**
* Code used in Samples and Demo Pages
*/

// Public Variable with some sample data
var demoTasks = [];
demoTasks.push({task:'063001', error: true, date: '10/11/2015' ,desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063002', date: '10/11/2015' , desc: 'Part #4212132 has low inventory level', disabled: true});
demoTasks.push({task:'063003', date: '10/07/2015' , desc: 'Check #112412 parts ordering.'});
demoTasks.push({task:'063004', date: '10/07/2015' , desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063005', date: '10/11/2015' , desc: 'Call XYZ Inc at 5 PM'});
demoTasks.push({task:'063006', error: true, date: '10/11/2015' , desc: 'Part #4212132 has low inventory level'});
demoTasks.push({task:'063007', date: '07/11/2015' , desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063008', date: '10/11/2015' , desc: 'Part #5212132 has low inventory level'});
demoTasks.push({task:'063009', date: '10/07/2015' , desc: 'Check #212412 parts ordering.'});
demoTasks.push({task:'063010', date: '10/11/2015' , desc: 'Special fields test - New item has been created.'});
demoTasks.push({task:'063011', date: '10/11/2015' , desc: 'Call TMZ Inc at 5 PM'});
demoTasks.push({task:'063012', date: '07/08/2015' , desc: 'Part #6212132 has low inventory level'});

var demoBuilderItems = [];
demoBuilderItems.push({ id: 1, orderId: '4231212-3', items: 0, companyName: 'John Smith Construction', total: '$0.00' });
demoBuilderItems.push({ id: 2, orderId: '1092212-3', items: 4, companyName: 'Top Grade Construction', total: '$10,000.00' });
demoBuilderItems.push({ id: 3, orderId: '6721212-3', items: 0, companyName: 'Riverhead Building Supply', total: '$0.00' });
demoBuilderItems.push({ id: 4, orderId: '6731212-3', items: 37, companyName: 'United Starwars Construction', total: '$22,509.99' });
demoBuilderItems.push({ id: 5, orderId: '5343890-3', items: 8, companyName: 'United Construction', total: '$1,550.00' });
demoBuilderItems.push({ id: 6, orderId: '4989943-3', items: 156, companyName: 'Top Grade-A Construction', total: '$800.00' });
demoBuilderItems.push({ id: 7, orderId: '8972384-3', items: 10, companyName: 'Top Grade Construction', total: '$1,300.00' });
demoBuilderItems.push({ id: 8, orderId: '2903866-3', items: 96, companyName: 'Top Grade-A Construction', total: '$1,900.00' });
demoBuilderItems = demoBuilderItems.concat(demoBuilderItems); // Duplicate it

// Execute Page Code for Demo Page
$(function($) {

  // Message.html View Specifics
  $('#show-application-error').on('click', function() {
      $('body').message({
          title: 'Application Error',
          isError: true,
          returnFocus: $(this),
          message: 'This application has experienced a system error due to the lack of internet access. Please restart the application in order to proceed.',
          buttons: [{
              text: 'Restart Now',
              click: function() {
                  $(this).modal('close');
              },
              isDefault: true
          }]
      });
  });

  $('#show-fileupload-confirmation').on('click', function() {
      $('body').message({
          title: 'File Upload Complete',
          message: 'Your file "<b>photo.png</b>" was sucessfully uploaded to your personal folder and is now public for viewing.',
          returnFocus: $(this),
          buttons: [{
              text: 'Done',
              click: function() {
                  $(this).modal('close');
              },
              isDefault: true
          }]
      });
  });

  $('#show-delete-confirmation').on('click', function() {

    $('body').message({
      title: 'Delete this Application?',
      message: 'You are about to delete this application permanently. Would you like to proceed?',
      returnFocus: $(this),
      buttons: [{
        text: 'No',
        click: function(e, modal) {
          modal.close();
        }
      }, {
        text: 'Yes',
        click: function(e, modal) {
          modal.close();
        },
        isDefault: true
      }]
    });

  });

  // Modal.html View Specifics
  $('#btn-add-comment').on('click', function() {

    $('body').modal({
      title: 'Add a Comment',
      content: '<small class="alert-text">Escalated (2X)</small><br><h3 style="padding: 0px 15px; margin-top: 8px;">Follow up action with HMM Global </h3><p style="padding: 0px 15px">Contact sales representative with the updated purchase <br> '+
          'order before submission.</p><br><label for="dialog-comment" class="audible">Comment</label><textarea name="dialog-comment" style="width: 100%" id="dialog-comment"></textarea>',
      buttons: [{
        text: 'Cancel',
        click: function(e, modal) {
          modal.close();
        }
      }, {
        text: 'Submit',
        click: function(e, modal) {
          modal.close();
        },
        isDefault: true
      }]
    });

  });

  // Toast.html View Specifics
  var cnt = 0;
  $('#show-toast-message').on('click', function() {
    cnt ++;
    $('body').toast({title: 'Application Offline' + cnt, message: 'This is a Toast message'});
  });


  // Autocomplete.html View Specifics
  // Setup an alternate source for the templated Autocomplete.
  $('#auto-template').autocomplete({
    source: function (req, resp) {
      var data = [];
      data.push({ label: 'John Smith', email: 'John.Smith@example.com', value: '0' });
      data.push({ label: 'Alex Mills', email: 'Alex.Mills@example.com', value: '1' });
      data.push({ label: 'Steve Mills', email: 'Steve.Mills@example.com', value: '2' });
      data.push({ label: 'Quincy Adams', email: 'Quincy.Adams@example.com', value: '3' });
      data.push({ label: 'Paul Thompson', email: 'Paul.Thompson@example.com', value: '4' });
      resp(req, data);
    }
  }).on('selected', function (e, anchor) {
    console.log('Changed to: ' + $(anchor).parent().attr('data-value'));
  });

  // Searchfield.html View Specifics
  function searchfieldCallback(noResultsContent) {
    $('body').toast({
      title: noResultsContent,
      message: 'Show All Results Callback has been triggered'
    });
  }

  // Toast Message Callback for the Default Searchfield
  $('#searchfield').searchfield({
    allResultsCallback: searchfieldCallback,
    source: '/api/states?term='
  });
  $('#searchfield-default').searchfield({
    allResultsCallback: searchfieldCallback
  });

  // Setup an external source for the templated searchfield
  $('#searchfield-template').searchfield({
    source: '/api/states?term='
  }).on('selected', function (e, anchor) {
    console.log('Changed to: ' + $(anchor).parent().attr('data-value'));
  });

  // Run these on 'body.initialized' event
  $('body').on('initialized', function() {

    //----------------------------------------------------------
    //  Examples: Animated Pseudo-Element Icons
    //----------------------------------------------------------

    $('#icon-plus-minus').click(function() {
      $(this).toggleClass('active');
    });

    $('#icon-app-header').click(function() {
      var mode = $(this).data('mode');
      if (!mode || mode === undefined) {
        mode = 0;
      }
      mode++;

      switch(mode) {
        case 1:
          $(this).removeClass('close').addClass('go-back');
          break;
        case 2:
          $(this).removeClass('go-back').addClass('close');
          break;
        case 3:
          $(this).removeClass('close').removeClass('go-back');
          mode = 0;
          break;
      }

      $(this).data('mode', mode);
    });

    //----------------------------------------------------------
    //  Examples: Tabs
    //----------------------------------------------------------

    // Randomize the numbers on the Tabs Counts example
    $('#tabs-counts').find('li > a > .count').each(function() {
      $(this).text((Math.floor(Math.random() * (20 - 0)) + 0) + ' ');
    });

    //----------------------------------------------------------
    //  Examples: Contextual Action Panel
    //----------------------------------------------------------

    // Build the Datagrid that goes into the Settings-based Contextual Action Panel
    var data = [],
      columns = [];

    columns.push({ id: 'date', name: 'Date', field: 'date', width: 125, formatter: Formatters.Date});
    columns.push({ id: 'description', name: 'Description', field: 'description', width: 140, formatter: Formatters.Readonly});
    columns.push({ id: 'paidBy', name: 'Paid By', field: 'PaidBy', formatter: Formatters.Readonly});
    columns.push({ id: 'category', name: 'Category', field: 'category', formatter: Formatters.Readonly});
    columns.push({ id: 'projectWork', name: 'Project Work', field: 'projectWork', formatter: Formatters.Readonly});
    columns.push({ id: 'resource', name: 'Resource', field: 'resource', formatter: Formatters.Readonly});
    columns.push({ id: 'amount', name: 'Amount', field: 'amount', formatter: Formatters.Readonly});

    data.push({ date: new Date(2015, 1, 20), description: 'Pending Benefits', paidBy: 'PR', category: '2244 Personnel', projectWork: 'Structural Design', resource: 'Charles Dunn', amount: '$204.00' });
    data.push({ date: new Date(2015, 1, 24), description: 'Pending Wages', paidBy: 'PR', category: '2244 Personnel', projectWork: 'Structural Design', resource: 'Vendor 3 Meylin Clark', amount: '$146.00' });
    data.push({ date: new Date(2015, 1, 24), description: 'Apple Computer INC', paidBy: 'AP', category: '2919 Supplies', projectWork: 'Structural Design', resource: 'Vendor 3 Meylin Clark', amount: '$1299.00' });
    data.push({ date: new Date(2015, 2, 02), description: 'PO #1292', paidBy: 'AP', category: '2244 Personnel', projectWork: 'Structural Design', resource: 'Vendor 3 Meylin Clark', amount: '$398.00' });

    $('.contextual-action-panel > .datagrid').datagrid({
      columns: columns,
      dataset: data
    });

    // Build the Settings-based Contextual Action Panel
    $('#js-contextual-panel').contextualactionpanel({
      title: 'Expenses: $50,000.00',
      buttons: [
        {
          text: 'Currency',
          cssClass: 'btn',
          click: function() {
            alert('Currency!');
          }
        },
        {
          text: 'Close',
          cssClass: 'btn',
          icon: '#icon-close',
          click: function() {
            $(this).modal('close');
          }
        }
      ]
    });

    $('#manual-contextual-panel').off('click').on('click', function() {

      $('body').contextualactionpanel({
        title: 'Expenses: $50,000.00',
        content: '<div class="two-column"><div style="height: 300px; width: 200px;"></div></div>',
        trigger: 'immediate',
        buttons: [
          {
            type: 'input',
            text: 'Keyword',
            id: 'filter',
            name: 'filter',
            cssClass: 'searchfield'
          }, {
            text: 'Close',
            cssClass: 'btn',
            icon: '#icon-close',
            click: function() {
              $(this).modal('close');
            }
          }
        ]
      }).on('close', function () {
        $('#new-grid').closest('.contextual-action-panel').remove();
      });

      $('#new-grid').datagrid({
        columns: columns,
        dataset: data
      });

    });

    //----------------------------------------------------------
    //  Tests: Validation
    //----------------------------------------------------------

    // duplicates the "required" value checker
    function requiredCheck(value) {
      if (typeof value === 'string' && $.trim(value).length === 0) {
        return false;
      }
      return (value ? true : false);
    }

    // This test adds an additional validation rule.
    $.fn.validation.rules['also-required'] = {
      check: function(value) {
        return false;
      },
      message: 'This is a custom validation rule that duplicates the functionality of the "required" rule built into the validator, but has this really long message instead.  This is testing the size of error message tooltips, as well as testing that custom rules work properly.', //TODO - Localize
      async: false
    };

    $.fn.validation.rules['dd-required'] = {
      check: requiredCheck,
      message: 'This dropdown is required.  Please select an option from the Dropdown.',
      async: false
    };

    //----------------------------------------------------------
    //  Nav Patterns: Test Page
    //----------------------------------------------------------
    var mainHeader = $('body > header').first(),
      mainHeaderData = mainHeader.data('header');

    function navPatternButtonClick() {
      var btn = $(this),
        btns = $('[id^="navpattern-"]'),
        newOpts = $.extend({}, btn.data('demoOptions')),
        type;

      $('body > .page-container').find('.wizard-panel:not(.tab-panel)').removeAttr('id');

      newOpts.useAlternate = $('#navpattern-alt-breadcrumb').prop('checked');
      mainHeader.header(newOpts);
      mainHeaderData = mainHeader.data('header');

      type = btn.data('navType');
      if (!type) {
        btns.enable();
      } else {
        switch(type) {
          case 'drilldown':
          btns.not('#navpattern-reset').not('[id*="#navpattern-drilldown-"]').disable();
          break;
          case 'breadcrumb':
          btns.not('#navpattern-reset').not('[id*="#navpattern-breadcrumb-"]').disable();
          break;
          case 'tabs':
          btns.not('#navpattern-reset').disable();
          break;
          case 'wizard':
          btns.not('#navpattern-reset').disable();
        }
      }

      var callback = $(this).data('demoCallback');
      if (callback && typeof callback === 'function') {
        callback.apply(this);
      }
    }

    function navPatternDrillUpLoop() {
      while (mainHeaderData.levelsDeep.length > 2 ) {
        mainHeader.trigger('drillup');
      }
    }

    mainHeader.on('drillTop.demo', function() {
      $('[id^="navpattern-"]').enable();
    });

    $('#navpattern-reset')
      .data('demoOptions', {
        tabs: null,
        useBackbutton: true,
        useBreadcrumb: false,
        wizardTicks: null
      }).click(navPatternButtonClick);

    var drilldownOpts = {
      tabs: null,
      useBackbutton: true,
      useBreadcrumb: false,
      wizardTicks: null
    };

    $('#navpattern-drilldown-1')
      .data('demoOptions', drilldownOpts)
      .data('demoCallback', function () {
        navPatternDrillUpLoop();
        mainHeader.trigger('drilldown', ['Drilldown Level One']);
      })
      .data('navType', 'drilldown')
      .click(navPatternButtonClick);

    $('#navpattern-drilldown-2')
      .data('demoOptions', drilldownOpts)
      .data('demoCallback', function () {
        navPatternDrillUpLoop();
        mainHeader.trigger('drilldown', ['Drilldown Level One']);
        mainHeader.trigger('drilldown', ['Drilldown Level Two']);
      })
      .data('navType', 'drilldown')
      .click(navPatternButtonClick);

    var breadcrumbOpts = {
      tabs: null,
      useBackbutton: true,
      useBreadcrumb: true,
      wizardTicks: null
    };

    $('#navpattern-breadcrumb-1').data('demoOptions', breadcrumbOpts)
      .data('demoCallback', function () {
        navPatternDrillUpLoop();
        mainHeader.trigger('drilldown', ['Breadcrumb Level One']);
      })
      .data('navType', 'breadcrumb')
      .click(navPatternButtonClick);

    $('#navpattern-breadcrumb-2')
      .data('demoOptions', breadcrumbOpts)
      .data('demoCallback', function () {
        navPatternDrillUpLoop();
        mainHeader.trigger('drilldown', ['Breadcrumb Level One']);
        mainHeader.trigger('drilldown', ['Breadcrumb Level Two']);
      })
      .data('navType', 'breadcrumb')
      .click(navPatternButtonClick);

    $('#navpattern-breadcrumb-3')
      .data('demoOptions', breadcrumbOpts)
      .data('demoCallback', function () {
        navPatternDrillUpLoop();
        mainHeader.trigger('drilldown', ['Breadcrumb Level One']);
        mainHeader.trigger('drilldown', ['Breadcrumb Level Two']);
        mainHeader.trigger('drilldown', ['Breadcrumb Level Three']);
      })
      .data('navType', 'breadcrumb')
      .click(navPatternButtonClick);

    var createTabsOpts = {
      useBreadcrumb: false,
      useBackbutton: false,
      tabs: [1,2], // NOTE: these settings aren't final.
      wizardTicks: null
    };

    $('#navpattern-create-tabs')
      .data('demoOptions', createTabsOpts)
      .data('navType', 'tabs')
      .click(navPatternButtonClick);

    var createWizardOpts = {
      useBreadcrumb: false,
      useBackbutton: false,
      tabs: null,
      wizardTicks: [1,2] // NOTE: these settings aren't final.
    };

    function wizardCallback() {
      var wizard = mainHeader.data('header').wizard,
        wizardPanels = $('body > .page-container').find('.wizard-panel');

      wizard.data('wizard').ticks.each(function(i, item) {
        var id = $(item).text().trim().replace(/ /g, '-').toLowerCase();

        if (wizardPanels[i] !== wizardPanels[0]) {
          $(item).attr('data-wizard-panel', '' + id);
          $(wizardPanels[i]).attr('id', id);
        }
        else {
          // Use the default ID for the first panel
          $(item).attr('data-wizard-panel', $(wizardPanels[i]).attr('id'));
          //$(wizardPanels[i]).attr('id', $(item).attr('id'));
        }
      });

      wizard.off('stepchange.demo').on('stepchange.demo', function stepChangeListener(e, tick) {
        var thisPanel = wizardPanels.filter('#'+ tick.attr('data-wizard-panel')),
          otherPanels = wizardPanels.not('#'+ tick.attr('data-wizard-panel'));

        otherPanels.css({'display': 'none', 'opacity': '0'});
        thisPanel.css('display', 'block');
        thisPanel[0].offsetHeight;
        thisPanel.css('opacity', '1');
      });
    }

    $('#navpattern-create-wizard')
      .data('demoOptions', createWizardOpts)
      .data('demoCallback', wizardCallback)
      .data('navType', 'wizard')
      .click(navPatternButtonClick);

  });

});
