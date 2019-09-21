(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink'),
		navshadow = document.getElementById('nav-shadow');//点击阴影

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';
		var nactive ='nactive';
		var displayBlock ='displayBlock';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
		toggleClass(navshadow, displayBlock);
		toggleClass(navshadow, nactive);
    };

	navshadow.onclick = function (e) {
        var active = 'active';
		var nactive ='nactive';
		var displayBlock ='displayBlock';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
		toggleClass(navshadow, displayBlock);
		toggleClass(navshadow, nactive);
    };

}(this, this.document));
