minidom_eval <- function(code) {
  context <- QuickJSR::JSContext$new()
  context$source(system.file("js", "minidom.min.js", package = "controlcharts"))
  context$source(system.file("htmlwidgets", "lib", "UTILS", "ccCore.min.js",
                             package = "controlcharts"))
  context$source(code = paste0(
    "function runTest() { const document = minidom.dummyDOM().document;\n",
    code, "\n}"
  ))
  context$call("runTest")
}

testthat::test_that("minidom preserves tree links when moving and clearing children", {
  result <- minidom_eval(r"(
    const root = document.createElement('g');
    const a = root.appendChild(document.createElement('a'));
    const b = root.appendChild(document.createElement('b'));
    const c = root.appendChild(document.createElement('c'));
    root.insertBefore(a, c);
    root.insertBefore(a, a);
    const moved = root.childNodes[0] === b && root.childNodes[1] === a
      && root.childNodes[2] === c && root.firstChild === b && root.lastChild === c
      && b.previousSibling === null && b.nextSibling === a && a.previousSibling === b
      && a.nextSibling === c && c.previousSibling === a && c.nextSibling === null;
    root.innerHTML = '';
    const cleared = root.childNodes.length === 0 && root.firstChild === null
      && root.lastChild === null && a.parentNode === null
      && a.previousSibling === null && a.nextSibling === null;
    root.appendChild(a);
    root.textContent = 'replacement';
    const replaced = a.parentNode === null && a.nextSibling === null
      && a.previousSibling === null && root.childNodes.length === 1;
    root.appendChild(a);
    return {moved: moved, cleared: cleared, replaced: replaced, text: root.textContent};
  )")
  testthat::expect_identical(result, list(
    moved = TRUE, cleared = TRUE, replaced = TRUE, text = "replacement"
  ))
})

testthat::test_that("minidom replaces children and detaches the previous nodes", {
  result <- minidom_eval(r"(
    const root = document.createElement('g');
    const old = root.appendChild(document.createElement('text'));
    const replacement = document.createElement('text');
    replacement.textContent = 'new';
    root.replaceChildren(replacement, ' label');
    const replaced = root.textContent === 'new label' && old.parentNode === null
      && root.firstChild === replacement && replacement.nextSibling === root.lastChild;
    root.replaceChildren();
    return {replaced, cleared: root.childNodes.length === 0 && root.firstChild === null
      && root.lastChild === null && replacement.parentNode === null
      && replacement.nextSibling === null};
  )")
  testthat::expect_identical(result, list(replaced = TRUE, cleared = TRUE))
})

testthat::test_that("minidom serializes current attributes and escapes text once", {
  result <- minidom_eval(r"(
    const root = document.createElement('svg');
    const child = ccCore.select(root).append('text').attr('fill', 'red');
    child.attr('fill', null).attr('fill', 'blue').attr('title', '"<&');
    child.classed('active', true).classed('active', false).classed('active', true);
    child.text('A & B < C > D &amp;');
    const clone = child.node().cloneNode(true);
    child.attr('title', null);
    root.appendChild(child.node().cloneNode(true));
    child.attr('empty', '');
    return {
      svg: root.innerHTML,
      empty: child.attr('empty'),
      inherited: clone.hasAttribute('constructor'),
      clonedText: clone.textContent
    };
  )")
  xml <- xml2::read_xml(paste0("<svg>", result$svg, "</svg>"))
  children <- xml2::xml_children(xml)
  testthat::expect_equal(xml2::xml_attr(children, "fill"), rep("blue", 2))
  testthat::expect_equal(xml2::xml_attr(children, "class"), rep("active", 2))
  testthat::expect_true(all(is.na(xml2::xml_attr(children, "title"))))
  testthat::expect_equal(xml2::xml_text(children), rep("A & B < C > D &amp;", 2))
  testthat::expect_identical(result$empty, "")
  testthat::expect_false(result$inherited)
  testthat::expect_identical(result$clonedText, "A & B < C > D &amp;")
})

testthat::test_that("minidom supports selectors used by chart redraws", {
  result <- minidom_eval(r"(
    const root = document.createElement('svg');
    const group = ccCore.select(root).append('g').attr('class', 'tick');
    const text = group.append('text').attr('class', 'label\tactive').attr('id', 'value');
    group.append('line');
    const selected = root.querySelectorAll(' .tick\t  text.label.active#value, line ').length;
    const first = root.querySelector('.tick text') === text.node();
    group.selectAll('*').remove();
    return {selected: selected, first: first, remaining: group.node().childNodes.length};
  )")
  testthat::expect_equal(result, list(selected = 2, first = TRUE, remaining = 0))
})

testthat::test_that("minidom keeps styles and style attributes synchronized", {
  result <- minidom_eval(r"(
    const root = document.createElement('svg');
    const child = ccCore.select(root).append('rect');
    child.attr('style', 'fill: red !important; fill: blue; font-family: "a;b"');
    const fill = child.style('fill');
    const font = child.style('font-family');
    child.style('opacity', 0);
    const opacity = child.style('opacity');
    const clone = child.node().cloneNode();
    child.style('fill', 'green', 'important');
    const removed = child.node().style.removeProperty('opacity');
    const serialized = root.innerHTML;
    child.attr('style', null);
    return {
      fill: fill, font: font, opacity: opacity, removed: removed,
      cloneFill: clone.style.getPropertyValue('fill'),
      clonePriority: clone.style.getPropertyPriority('fill'),
      cleared: child.node().style.getPropertyValue('fill'),
      hasStyle: child.node().hasAttribute('style'), svg: serialized
    };
  )")
  testthat::expect_identical(result$fill, "red")
  testthat::expect_identical(result$font, '"a;b"')
  testthat::expect_identical(result$opacity, "0")
  testthat::expect_identical(result$removed, "0")
  testthat::expect_identical(result$cloneFill, "red")
  testthat::expect_identical(result$clonePriority, "important")
  testthat::expect_identical(result$cleared, "")
  testthat::expect_false(result$hasStyle)
  xml <- xml2::read_xml(result$svg)
  testthat::expect_match(xml2::xml_attr(xml, "style"), "fill:green !important", fixed = TRUE)
})

testthat::test_that("minidom preserves namespaced attributes through D3 and serialization", {
  result <- minidom_eval(r"(
    const root = document.createElement('svg');
    const child = ccCore.select(root).append('use').attr('xlink:href', '#symbol');
    const href = child.attr('xlink:href');
    const clone = child.node().cloneNode();
    root.appendChild(clone);
    child.attr('xlink:href', null);
    return {href: href, removed: child.attr('xlink:href') === null, svg: root.innerHTML};
  )")
  testthat::expect_identical(result$href, "#symbol")
  testthat::expect_true(result$removed)
  xml <- xml2::read_xml(paste0("<svg>", result$svg, "</svg>"))
  testthat::expect_length(xml2::xml_find_all(
    xml, ".//use[@xlink:href='#symbol']", c(xlink = "http://www.w3.org/1999/xlink")
  ), 1)
})

testthat::test_that("minidom compares ancestors, siblings, cousins, and detached nodes", {
  result <- minidom_eval(r"(
    const root = document.createElement('svg');
    const left = root.appendChild(document.createElement('g'));
    const right = root.appendChild(document.createElement('g'));
    const a = left.appendChild(document.createElement('text'));
    const b = right.appendChild(document.createElement('text'));
    const detached = document.createElement('g');
    const forward = root.compareDocumentPosition(detached);
    const backward = detached.compareDocumentPosition(root);
    return {
      same: a.compareDocumentPosition(a), ancestor: root.compareDocumentPosition(a),
      descendant: a.compareDocumentPosition(root), sibling: left.compareDocumentPosition(right),
      cousin: a.compareDocumentPosition(b), reverse: b.compareDocumentPosition(a),
      disconnected: (forward & 33) === 33 && (backward & 33) === 33
        && (forward ^ backward) === 6
    };
  )")
  testthat::expect_equal(result, list(
    same = 0, ancestor = 20, descendant = 10, sibling = 4,
    cousin = 4, reverse = 2, disconnected = TRUE
  ))
})

testthat::test_that("chart text survives static rendering and resized export", {
  text <- 'A & B < C > D "quoted" &amp;'
  dat <- data.frame(
    organisation = LETTERS[1:4], indicator = text, grouping = text,
    numerator = c(8, 5, 4, 6), denominator = 10
  )
  for (objects in list("static_plot", c("html_plot", "static_plot"))) {
    chart <- misc(
      dat, keys = organisation, numerators = numerator, denominators = denominator,
      indicators = indicator, target = "A",
      title = list(text = text, subtitle = text),
      misc_settings = list(favourable_label = text),
      x_axis_settings = list(xlimit_label = text), return_objs = objects
    )
    xml <- xml2::xml_ns_strip(xml2::read_xml(chart$static_plot$svg))
    for (class in c("misc-y-tick", "chart-title", "chart-subtitle")) {
      node <- xml2::xml_find_first(xml, paste0('.//*[@class="', class, '"]'))
      testthat::expect_identical(xml2::xml_text(node), text, info = class)
    }
    labels <- xml2::xml_find_all(xml, './/*[@class="misc-root"]/text')
    testthat::expect_equal(sum(xml2::xml_text(labels) == text), 3)
    output <- tempfile(fileext = ".svg")
    chart$save_plot(output, width = 720, height = 480)
    saved <- xml2::xml_ns_strip(xml2::read_xml(output))
    unlink(output)
    testthat::expect_identical(
      xml2::xml_text(xml2::xml_find_first(saved, './/*[@class="chart-title"]')), text
    )

    points <- data.frame(key = 1:3, value = c(10, 12, 11), label = c(NA, text, NA))
    chart <- spc(
      points, keys = key, numerators = value, labels = label,
      title = list(text = text, subtitle = text),
      spc_settings = list(chart_type = "i"), return_objs = objects
    )
    xml <- xml2::xml_ns_strip(xml2::read_xml(chart$static_plot$svg))
    testthat::expect_identical(
      xml2::xml_text(xml2::xml_find_first(xml, './/*[@class="text-labels"]//text')), text
    )
    testthat::expect_identical(
      xml2::xml_text(xml2::xml_find_first(xml, './/*[@class="chart-title"]')), text
    )
  }
})

testthat::test_that("SPC and funnel line labels scale with their font size", {
  dat <- data.frame(key = 1:4, numerator = c(10, 12, 11, 14), denominator = 100)
  for (chart_function in list(spc, funnel)) {
    for (size in c(10, 20)) {
      chart <- chart_function(
        dat, keys = key, numerators = numerator, denominators = denominator,
        line_settings = list(plot_label_show_target = TRUE, plot_label_size_target = size),
        return_objs = "static_plot"
      )
      xml <- xml2::xml_ns_strip(xml2::read_xml(chart$static_plot$svg))
      labels <- xml2::xml_find_all(xml, './/*[@class="linesgroup"]/text[text()]')
      testthat::expect_gt(length(labels), 0)
      testthat::expect_true(all(xml2::xml_attr(labels, "dy") == paste0(size / 4, "px")))
    }
  }
})

testthat::test_that("minidom parentElement stops at the document", {
  result <- minidom_eval(r"(
    const root = document.createElement('div');
    const child = root.appendChild(document.createElement('span'));
    return {
      child: child.parentElement === root,
      detached: root.parentElement === null,
      body: document.body.parentElement === document.documentElement,
      html: document.documentElement.parentElement === null
    };
  )")
  testthat::expect_identical(result, list(
    child = TRUE, detached = TRUE, body = TRUE, html = TRUE
  ))
})

testthat::test_that("minidom selector lists match once per element in document order", {
  result <- minidom_eval(r"(
    const root = document.createElement('div');
    root.className = 'container';
    document.body.appendChild(root);
    const first = root.appendChild(document.createElement('span'));
    first.setAttribute('id', 'first');
    first.className = 'item selected';
    const second = root.appendChild(document.createElement('span'));
    second.setAttribute('id', 'second');
    second.className = 'other';
    const third = root.appendChild(document.createElement('div'));
    third.setAttribute('id', 'third');
    const matches = root.querySelectorAll('.other, .item, .selected');
    const ids = [];
    for (let i = 0; i < matches.length; i++) {
      ids.push(matches[i].getAttribute('id'));
    }
    return {
      ids: ids,
      first: root.querySelector('.other,.item').getAttribute('id'),
      descendant: first.matches('.absent, .container .item'),
      tag: third.matches('.absent, div'),
      id: first.matches('#second, #first'),
      absent: third.matches('.other, .item')
    };
  )")
  testthat::expect_identical(result, list(
    ids = c("first", "second"), first = "first", descendant = TRUE,
    tag = TRUE, id = TRUE, absent = FALSE
  ))
})
