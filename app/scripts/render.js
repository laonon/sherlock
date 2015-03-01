define(['d3', 'lib/knockout', 'scripts/Utils', 'text!templates/example.html', 'dagre-d3', 'jquery', 'jquery.tipsy'],
  function (d3, ko, Utils, example, dagreD3, $) {
    'use strict';
    function renderPage(skills_data) {
      var g = new dagreD3.graphlib.Graph().setGraph({});

      (skills_data.skills).forEach(function (skill) {
        var value = skill;
        value.label = skill.name;
        value.rx = value.ry = 5;
        g.setNode(skill.name, value);
      });

      //g.setEdge("HTML", "Web", {label: "open"});
      g.setEdge("Web", "HTML", {label: ""});
      g.setEdge("Web", "CSS", {label: ""});
      g.setEdge("Web", "JavaScript", {label: ""});

      var render = new dagreD3.render();

      var svg = d3.select("svg"),
        inner = svg.append("g");

      var zoom = d3.behavior.zoom().on("zoom", function () {
        inner.attr("transform", "translate(" + d3.event.translate + ")" +
        "scale(" + d3.event.scale + ")");
      });
      svg.call(zoom);

      var styleTooltip = function (name, description) {
        return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
      };

      render(inner, g);

      inner.selectAll("g.node")
        .attr("title", function (v) {
          return styleTooltip(v, g.node(v).description)
        })
        .each(function (v) {
          $(this).tipsy({gravity: "w", opacity: 1, html: true});
        });

      var initialScale = 0.75;
      zoom
        .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
        .scale(initialScale)
        .event(svg);
      svg.attr('height', g.graph().height * initialScale + 40);
    }

    return {
      renderPage: renderPage
    };
  });
