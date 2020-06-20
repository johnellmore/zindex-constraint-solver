const test = require('baretest')('Sum tests');
const assert = require('assert');
const sass = require('sass');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const pluginFunctionsMap = require('./src/plugin');

function renderCssFromSass(sassCode) {
    const result = sass.renderSync({
        data: sassCode,
        outputStyle: 'compressed',
        functions: {
            ...pluginFunctionsMap,
        }
    });
    return result.css.toString();
}

function getElementZIndex(window, selector) {
    const document = window.document;
    const el = document.querySelector(selector);
    const styles = window.getComputedStyle(el);
    const zIndex = styles.zIndex;
    return zIndex;
}

function makeDomWindowWithCss(css) {
    // make ten div tags, with letters as their class names
    const els = 'abcdefghij'.split('').map(ch => `<div class="${ch}"></div>`);

    // assemble the HTML doc together
    const styleTag = `<style>${css}</style>`;
    const html = `<!DOCTYPE html>${styleTag}${els.join()}`;

    // parse the HTML into a virtual DOM
    const dom = new JSDOM(html, { resources: "usable" });
    return dom.window;
}

test('Basic style presence assertion', function() {
    const scss = `
        .a { z-index: 1; }
        .b { z-index: 2; }
    `;
    const css = renderCssFromSass(scss);
    const window = makeDomWindowWithCss(css);
    assert.equal(getElementZIndex(window, '.a'), '1');
    assert.equal(getElementZIndex(window, '.b'), '2');
});

test('Unrelated elements return z-index of 1', function () {
    const scss = `
        .a { z-index: zPosition('a'); }
        .b { z-index: zPosition('b'); }
    `;
    const css = renderCssFromSass(scss);
    const window = makeDomWindowWithCss(css);
    const aZ = getElementZIndex(window, '.a');
    const bZ = getElementZIndex(window, '.b');
    assert.equal(aZ, '1');
    assert.equal(bZ, '1');
});

test('Stacked elements return 2 on top and 1 on bottom', function () {
    const scss = `
        :root{ --z: zAbove("a", "b"); }
        .a { z-index: zPosition("a"); }
        .b { z-index: zPosition("b"); }
    `;
    const css = renderCssFromSass(scss);
    console.log(css);
    const window = makeDomWindowWithCss(css);
    const aZ = getElementZIndex(window, '.a');
    const bZ = getElementZIndex(window, '.b');
    assert.equal(aZ, '2');
    assert.equal(bZ, '1');
});

test.run()
