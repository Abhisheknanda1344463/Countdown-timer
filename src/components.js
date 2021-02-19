export default function(editor, opt = {}) {
  const c = opt;
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const textType = domc.getType('text');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;
  const textModel = textType.model;
  const textView = textType.view;
  const pfx = c.countdownClsPfx;
  const COUNTDOWN_TYPE = 'countdown';

  domc.addType(COUNTDOWN_TYPE, {

    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        startfrom: c.startTime,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 20c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8m0-18c5.52 0 10 4.48 10 10s-4.48 10-10 10C6.47 22 2 17.5 2 12 2 6.48 6.48 2 12 2m.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"></path></svg>`,
        endText: c.endText,
        droppable: false,
        traits: [{
          label: 'Start',
          name: 'startfrom',
          changeProp: 1,
          type: c.dateInputType,
        },{
          label: 'End text',
          name: 'endText',
          changeProp: 1,
        }],
        script: function() {
          var startfrom = '{[ startfrom ]}';
          var endTxt = '{[ endText ]}';
          var countDownDate = new Date(startfrom).getTime();
          var countdownEl = this.querySelector('[data-js=countdown]');
          var endTextEl = this.querySelector('[data-js=countdown-endtext]');
          var dayEl = this.querySelector('[data-js=countdown-day]');
          var hourEl = this.querySelector('[data-js=countdown-hour]');
          var minuteEl = this.querySelector('[data-js=countdown-minute]');
          var secondEl = this.querySelector('[data-js=countdown-second]');
          var oldInterval = this.gjs_countdown_interval;
          if(oldInterval) {
            oldInterval && clearInterval(oldInterval);
          }

          var setTimer = function (days, hours, minutes, seconds) {
            dayEl.innerHTML = days < 10 ? '0' + days : days;
            hourEl.innerHTML = hours < 10 ? '0' + hours : hours;
            minuteEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
            secondEl.innerHTML = seconds < 10 ? '0' + seconds : seconds ;
          }

          var moveTimer = function() {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var days = Math.floor(distance / 86400000);
            var hours = Math.floor((distance % 86400000) / 3600000);
            var minutes = Math.floor((distance % 3600000) / 60000);
            var seconds = Math.floor((distance % 60000) / 1000);

            setTimer(days, hours, minutes, seconds);

            /* If the count down is finished, write some text */
            if (distance < 0) {
              clearInterval(interval);
              endTextEl.innerHTML = endTxt;
              countdownEl.style.display = 'none';
              endTextEl.style.display = '';
            }
          };

          if (countDownDate) {
            var interval = setInterval(moveTimer, 1000);
            this.gjs_countdown_interval = interval;
            endTextEl.style.display = 'none';
            countdownEl.style.display = '';
            moveTimer();
          } else {
            setTimer(0, 0, 0, 0);
          }
        }
      },
    }, {
      isComponent(el) {
        if(el.getAttribute &&
          el.getAttribute('data-gjs-type') == COUNTDOWN_TYPE) {
          return {
            type: COUNTDOWN_TYPE
          };
        }
      },
    }),


    view: defaultView.extend({
      init() {
        this.listenTo(this.model, 'change:startfrom change:endText', this.updateScript);
        const comps = this.model.get('components');

        // Add a basic countdown template if it's not yet initialized
        if (!comps.length) {
          comps.reset();
          comps.add(`
            <span data-js="countdown" data-gjs-type="span" class="${pfx}-cont">
              <div class="${pfx}-block" data-gjs-type="box">
                <div data-js="countdown-day"  data-gjs-type="box" class="${pfx}-digit"></div>
                <div class="${pfx}-label" >${c.labelDays}</div>
              </div>
              <div class="${pfx}-block" data-gjs-type="box">
                <div data-js="countdown-hour" data-gjs-type="box" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${c.labelHours}</div>
              </div>
              <div class="${pfx}-block" data-gjs-type="box">
                <div data-js="countdown-minute" data-gjs-type="box" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${c.labelMinutes}</div>
              </div>
              <div class="${pfx}-block" data-gjs-type="box">
                <div data-js="countdown-second" data-gjs-type="box" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${c.labelSeconds}</div>
              </div>
            </span>
            <span data-js="countdown-endtext" class="${pfx}-endtext"></span>
          `);
        }

      }
    }),
  });
}
