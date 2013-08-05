(function($) {

  var defaultsettings = {
    'bgColor' : 'transparent',
    'fgColor' : 'red',
    'size' : 150,
    'donutwidth': 10,
    'textsize': 32,
    'barBg': '#ccc',
    'barFg': 'red',
    'animateSpeed': 30
  }
  
  var methods = {
    init : function(options) {
      
      var initcanvas=true;
      
      if (typeof(options) == "object")
      {
        this.donutchartsettings = $.extend({}, defaultsettings, options);
    
        // autoscale donutwidth and textsize
        if (options["size"] && !options["donutwidth"])
          this.donutchartsettings["donutwidth"]=options["size"]/4;
        if (options["size"] && !options["textsize"])
          this.donutchartsettings["textsize"]=options["size"]/3;
      }
      else
      {
        if (typeof(this.donutchartsettings) == "object")
          initcanvas=false;
        else
          this.donutchartsettings = defaultsettings;
      }
      
      if (initcanvas)
      {
        $(this).css("position","relative");
        $(this).html("<canvas width='"+this.donutchartsettings.size+"' height='"+this.donutchartsettings.size+"'></canvas><div class='percent'><div class='p-inner'></div><div class='p-text' style='font-size:"+this.donutchartsettings.textsize+"px;'></div></div>");
      
        var canvas = $("canvas",this).get(0);
      
        // excanvas support
        if (typeof(G_vmlCanvasManager) != "undefined")
          G_vmlCanvasManager.initElement(canvas);
      
        var ctx = canvas.getContext('2d');
        methods.drawBg.call(ctx, this.donutchartsettings);
      }

    },
    
    drawBg : function(settings) {
      this.clearRect(0,0,settings.size,settings.size);
      this.beginPath();
      this.fillStyle = settings.bgColor;
      this.arc(settings.size/2,settings.size/2,settings.size/2,0,2*Math.PI,false);
      this.arc(settings.size/2,settings.size/2,settings.size/2-settings.donutwidth,0,2*Math.PI,true);
      this.fill();
    },
    
    drawFg : function(settings,percent) {
      
      var ratio = percent/100 * 360;
      var startAngle = Math.PI*-90/180;
      var endAngle = Math.PI*(-90+ratio)/180;

      this.beginPath();
      this.fillStyle = settings.fgColor;
      this.arc(settings.size/2,settings.size/2,settings.size/2,startAngle,endAngle,false);
      this.arc(settings.size/2,settings.size/2,settings.size/2-settings.donutwidth,endAngle,startAngle,true);
      this.fill();
    },

  };
  
  $.fn.donutchart = function(method) {
    return this.each(function() {
      
      methods.init.call(this, method);

      if (method=="animate")
      {
        
        var percentage = $(this).attr("data-percent");
        var canvas = $(this).children("canvas").get(0);
        var percenttext = $(this).find("div.p-text");
        var dcs = this.donutchartsettings;

        if (canvas.getContext)
        {
          var ctx = canvas.getContext('2d');
          var j = 0;
          
          function animateDonutChart()
          {
            j++;

            methods.drawBg.call(ctx,dcs);
            methods.drawFg.apply(ctx,[dcs,j]);
            percenttext.text(j);

            if (j >= percentage)
              clearInterval(animationID);
          }
      
          var animationID = setInterval(animateDonutChart,20); 
        }
      }
    })
  }
})( jQuery );
