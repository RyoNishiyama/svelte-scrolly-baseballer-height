
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback, value) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            if (value === undefined) {
                callback(component.$$.ctx[index]);
            }
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/@sveltejs/svelte-scroller/Scroller.svelte generated by Svelte v3.55.0 */

    const { window: window_1 } = globals;
    const file$4 = "node_modules/@sveltejs/svelte-scroller/Scroller.svelte";
    const get_foreground_slot_changes = dirty => ({});
    const get_foreground_slot_context = ctx => ({});
    const get_background_slot_changes = dirty => ({});
    const get_background_slot_context = ctx => ({});

    function create_fragment$4(ctx) {
    	let svelte_scroller_outer;
    	let svelte_scroller_background_container;
    	let svelte_scroller_background;
    	let svelte_scroller_background_container_style_value;
    	let t;
    	let svelte_scroller_foreground;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[21]);
    	const background_slot_template = /*#slots*/ ctx[20].background;
    	const background_slot = create_slot(background_slot_template, ctx, /*$$scope*/ ctx[19], get_background_slot_context);
    	const foreground_slot_template = /*#slots*/ ctx[20].foreground;
    	const foreground_slot = create_slot(foreground_slot_template, ctx, /*$$scope*/ ctx[19], get_foreground_slot_context);

    	const block = {
    		c: function create() {
    			svelte_scroller_outer = element("svelte-scroller-outer");
    			svelte_scroller_background_container = element("svelte-scroller-background-container");
    			svelte_scroller_background = element("svelte-scroller-background");
    			if (background_slot) background_slot.c();
    			t = space();
    			svelte_scroller_foreground = element("svelte-scroller-foreground");
    			if (foreground_slot) foreground_slot.c();
    			set_custom_element_data(svelte_scroller_background, "class", "svelte-xdbafy");
    			add_location(svelte_scroller_background, file$4, 173, 2, 3978);
    			set_custom_element_data(svelte_scroller_background_container, "class", "background-container svelte-xdbafy");
    			set_custom_element_data(svelte_scroller_background_container, "style", svelte_scroller_background_container_style_value = "" + (/*style*/ ctx[5] + /*widthStyle*/ ctx[4]));
    			add_location(svelte_scroller_background_container, file$4, 172, 1, 3880);
    			set_custom_element_data(svelte_scroller_foreground, "class", "svelte-xdbafy");
    			add_location(svelte_scroller_foreground, file$4, 178, 1, 4140);
    			set_custom_element_data(svelte_scroller_outer, "class", "svelte-xdbafy");
    			add_location(svelte_scroller_outer, file$4, 171, 0, 3837);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_scroller_outer, anchor);
    			append_dev(svelte_scroller_outer, svelte_scroller_background_container);
    			append_dev(svelte_scroller_background_container, svelte_scroller_background);

    			if (background_slot) {
    				background_slot.m(svelte_scroller_background, null);
    			}

    			/*svelte_scroller_background_binding*/ ctx[22](svelte_scroller_background);
    			append_dev(svelte_scroller_outer, t);
    			append_dev(svelte_scroller_outer, svelte_scroller_foreground);

    			if (foreground_slot) {
    				foreground_slot.m(svelte_scroller_foreground, null);
    			}

    			/*svelte_scroller_foreground_binding*/ ctx[23](svelte_scroller_foreground);
    			/*svelte_scroller_outer_binding*/ ctx[24](svelte_scroller_outer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*onwindowresize*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (background_slot) {
    				if (background_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						background_slot,
    						background_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(background_slot_template, /*$$scope*/ ctx[19], dirty, get_background_slot_changes),
    						get_background_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*style, widthStyle*/ 48 && svelte_scroller_background_container_style_value !== (svelte_scroller_background_container_style_value = "" + (/*style*/ ctx[5] + /*widthStyle*/ ctx[4]))) {
    				set_custom_element_data(svelte_scroller_background_container, "style", svelte_scroller_background_container_style_value);
    			}

    			if (foreground_slot) {
    				if (foreground_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						foreground_slot,
    						foreground_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(foreground_slot_template, /*$$scope*/ ctx[19], dirty, get_foreground_slot_changes),
    						get_foreground_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(background_slot, local);
    			transition_in(foreground_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(background_slot, local);
    			transition_out(foreground_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_scroller_outer);
    			if (background_slot) background_slot.d(detaching);
    			/*svelte_scroller_background_binding*/ ctx[22](null);
    			if (foreground_slot) foreground_slot.d(detaching);
    			/*svelte_scroller_foreground_binding*/ ctx[23](null);
    			/*svelte_scroller_outer_binding*/ ctx[24](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const handlers = [];
    let manager;

    if (typeof window !== 'undefined') {
    	const run_all = () => handlers.forEach(fn => fn());
    	window.addEventListener('scroll', run_all);
    	window.addEventListener('resize', run_all);
    }

    if (typeof IntersectionObserver !== 'undefined') {
    	const map = new Map();

    	const observer = new IntersectionObserver((entries, observer) => {
    			entries.forEach(entry => {
    				const update = map.get(entry.target);
    				const index = handlers.indexOf(update);

    				if (entry.isIntersecting) {
    					if (index === -1) handlers.push(update);
    				} else {
    					update();
    					if (index !== -1) handlers.splice(index, 1);
    				}
    			});
    		},
    	{
    			rootMargin: '400px 0px', // TODO why 400?
    			
    		});

    	manager = {
    		add: ({ outer, update }) => {
    			const { top, bottom } = outer.getBoundingClientRect();
    			if (top < window.innerHeight && bottom > 0) handlers.push(update);
    			map.set(outer, update);
    			observer.observe(outer);
    		},
    		remove: ({ outer, update }) => {
    			const index = handlers.indexOf(update);
    			if (index !== -1) handlers.splice(index, 1);
    			map.delete(outer);
    			observer.unobserve(outer);
    		}
    	};
    } else {
    	manager = {
    		add: ({ update }) => {
    			handlers.push(update);
    		},
    		remove: ({ update }) => {
    			const index = handlers.indexOf(update);
    			if (index !== -1) handlers.splice(index, 1);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let top_px;
    	let bottom_px;
    	let threshold_px;
    	let style;
    	let widthStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scroller', slots, ['background','foreground']);
    	let { top = 0 } = $$props;
    	let { bottom = 1 } = $$props;
    	let { threshold = 0.5 } = $$props;
    	let { query = 'section' } = $$props;
    	let { parallax = false } = $$props;
    	let { index = 0 } = $$props;
    	let { count = 0 } = $$props;
    	let { offset = 0 } = $$props;
    	let { progress = 0 } = $$props;
    	let { visible = false } = $$props;
    	let outer;
    	let foreground;
    	let background;
    	let left;
    	let sections;
    	let wh = 0;
    	let fixed;
    	let offset_top = 0;
    	let width = 1;
    	let height;
    	let inverted;

    	onMount(() => {
    		sections = foreground.querySelectorAll(query);
    		$$invalidate(7, count = sections.length);
    		update();
    		const scroller = { outer, update };
    		manager.add(scroller);
    		return () => manager.remove(scroller);
    	});

    	function update() {
    		if (!foreground) return;

    		// re-measure outer container
    		const bcr = outer.getBoundingClientRect();

    		left = bcr.left;
    		$$invalidate(18, width = bcr.right - left);

    		// determine fix state
    		const fg = foreground.getBoundingClientRect();

    		const bg = background.getBoundingClientRect();
    		$$invalidate(10, visible = fg.top < wh && fg.bottom > 0);
    		const foreground_height = fg.bottom - fg.top;
    		const background_height = bg.bottom - bg.top;
    		const available_space = bottom_px - top_px;
    		$$invalidate(9, progress = (top_px - fg.top) / (foreground_height - available_space));

    		if (progress <= 0) {
    			$$invalidate(17, offset_top = 0);
    			$$invalidate(16, fixed = false);
    		} else if (progress >= 1) {
    			$$invalidate(17, offset_top = parallax
    			? foreground_height - background_height
    			: foreground_height - available_space);

    			$$invalidate(16, fixed = false);
    		} else {
    			$$invalidate(17, offset_top = parallax
    			? Math.round(top_px - progress * (background_height - available_space))
    			: top_px);

    			$$invalidate(16, fixed = true);
    		}

    		for (let i = 0; i < sections.length; i++) {
    			const section = sections[i];
    			const { top } = section.getBoundingClientRect();
    			const next = sections[i + 1];
    			const bottom = next ? next.getBoundingClientRect().top : fg.bottom;
    			$$invalidate(8, offset = (threshold_px - top) / (bottom - top));

    			if (bottom >= threshold_px) {
    				$$invalidate(6, index = i);
    				break;
    			}
    		}
    	}

    	const writable_props = [
    		'top',
    		'bottom',
    		'threshold',
    		'query',
    		'parallax',
    		'index',
    		'count',
    		'offset',
    		'progress',
    		'visible'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scroller> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, wh = window_1.innerHeight);
    	}

    	function svelte_scroller_background_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	function svelte_scroller_foreground_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			foreground = $$value;
    			$$invalidate(2, foreground);
    		});
    	}

    	function svelte_scroller_outer_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			outer = $$value;
    			$$invalidate(1, outer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('top' in $$props) $$invalidate(11, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(12, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(13, threshold = $$props.threshold);
    		if ('query' in $$props) $$invalidate(14, query = $$props.query);
    		if ('parallax' in $$props) $$invalidate(15, parallax = $$props.parallax);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('count' in $$props) $$invalidate(7, count = $$props.count);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(9, progress = $$props.progress);
    		if ('visible' in $$props) $$invalidate(10, visible = $$props.visible);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		handlers,
    		manager,
    		onMount,
    		top,
    		bottom,
    		threshold,
    		query,
    		parallax,
    		index,
    		count,
    		offset,
    		progress,
    		visible,
    		outer,
    		foreground,
    		background,
    		left,
    		sections,
    		wh,
    		fixed,
    		offset_top,
    		width,
    		height,
    		inverted,
    		update,
    		threshold_px,
    		top_px,
    		bottom_px,
    		widthStyle,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('top' in $$props) $$invalidate(11, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(12, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(13, threshold = $$props.threshold);
    		if ('query' in $$props) $$invalidate(14, query = $$props.query);
    		if ('parallax' in $$props) $$invalidate(15, parallax = $$props.parallax);
    		if ('index' in $$props) $$invalidate(6, index = $$props.index);
    		if ('count' in $$props) $$invalidate(7, count = $$props.count);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(9, progress = $$props.progress);
    		if ('visible' in $$props) $$invalidate(10, visible = $$props.visible);
    		if ('outer' in $$props) $$invalidate(1, outer = $$props.outer);
    		if ('foreground' in $$props) $$invalidate(2, foreground = $$props.foreground);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('left' in $$props) left = $$props.left;
    		if ('sections' in $$props) sections = $$props.sections;
    		if ('wh' in $$props) $$invalidate(0, wh = $$props.wh);
    		if ('fixed' in $$props) $$invalidate(16, fixed = $$props.fixed);
    		if ('offset_top' in $$props) $$invalidate(17, offset_top = $$props.offset_top);
    		if ('width' in $$props) $$invalidate(18, width = $$props.width);
    		if ('height' in $$props) height = $$props.height;
    		if ('inverted' in $$props) $$invalidate(31, inverted = $$props.inverted);
    		if ('threshold_px' in $$props) threshold_px = $$props.threshold_px;
    		if ('top_px' in $$props) top_px = $$props.top_px;
    		if ('bottom_px' in $$props) bottom_px = $$props.bottom_px;
    		if ('widthStyle' in $$props) $$invalidate(4, widthStyle = $$props.widthStyle);
    		if ('style' in $$props) $$invalidate(5, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*top, wh*/ 2049) {
    			top_px = Math.round(top * wh);
    		}

    		if ($$self.$$.dirty[0] & /*bottom, wh*/ 4097) {
    			bottom_px = Math.round(bottom * wh);
    		}

    		if ($$self.$$.dirty[0] & /*threshold, wh*/ 8193) {
    			threshold_px = Math.round(threshold * wh);
    		}

    		if ($$self.$$.dirty[0] & /*top, bottom, threshold, parallax*/ 47104) {
    			(update());
    		}

    		if ($$self.$$.dirty[0] & /*fixed, offset_top*/ 196608) {
    			$$invalidate(5, style = `
		position: ${fixed ? 'fixed' : 'absolute'};
		top: 0;
		transform: translate(0, ${offset_top}px);
		z-index: ${inverted ? 3 : 1};
	`);
    		}

    		if ($$self.$$.dirty[0] & /*fixed, width*/ 327680) {
    			$$invalidate(4, widthStyle = fixed ? `width:${width}px;` : '');
    		}
    	};

    	return [
    		wh,
    		outer,
    		foreground,
    		background,
    		widthStyle,
    		style,
    		index,
    		count,
    		offset,
    		progress,
    		visible,
    		top,
    		bottom,
    		threshold,
    		query,
    		parallax,
    		fixed,
    		offset_top,
    		width,
    		$$scope,
    		slots,
    		onwindowresize,
    		svelte_scroller_background_binding,
    		svelte_scroller_foreground_binding,
    		svelte_scroller_outer_binding
    	];
    }

    class Scroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				top: 11,
    				bottom: 12,
    				threshold: 13,
    				query: 14,
    				parallax: 15,
    				index: 6,
    				count: 7,
    				offset: 8,
    				progress: 9,
    				visible: 10
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scroller",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get top() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get query() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parallax() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parallax(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ScrollyAmericaHeight.svelte generated by Svelte v3.55.0 */
    const file$3 = "src/ScrollyAmericaHeight.svelte";

    // (53:2) 
    function create_background_slot$2(ctx) {
    	let div;
    	let section;
    	let img0;
    	let img0_src_value;
    	let img0_class_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let img1_class_value;
    	let t1;
    	let img2;
    	let img2_src_value;
    	let img2_class_value;
    	let t2;
    	let img3;
    	let img3_src_value;
    	let img3_class_value;
    	let section_resize_listener;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section = element("section");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			img2 = element("img");
    			t2 = space();
    			img3 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*mlbHeightImg*/ ctx[10])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "MLB's height histogram");
    			attr_dev(img0, "class", img0_class_value = "" + (null_to_empty(/*mlbHeightImgDsp*/ ctx[6]) + " svelte-pdmccs"));
    			add_location(img0, file$3, 54, 3, 1631);
    			if (!src_url_equal(img1.src, img1_src_value = /*lmbHeightImg*/ ctx[11])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "LMB's height histogram");
    			attr_dev(img1, "class", img1_class_value = "" + (null_to_empty(/*lmbHeightImgDsp*/ ctx[7]) + " svelte-pdmccs"));
    			add_location(img1, file$3, 55, 3, 1716);
    			if (!src_url_equal(img2.src, img2_src_value = /*lidomHeightImg*/ ctx[12])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "LIDOM's height histogram");
    			attr_dev(img2, "class", img2_class_value = "" + (null_to_empty(/*lidomHeightImgDsp*/ ctx[8]) + " svelte-pdmccs"));
    			add_location(img2, file$3, 56, 3, 1801);
    			if (!src_url_equal(img3.src, img3_src_value = /*lidomHeightFtImg*/ ctx[13])) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "LDOM's height histogram (feet and inch sclale)");
    			attr_dev(img3, "class", img3_class_value = "" + (null_to_empty(/*lidomHeightFtImgDsp*/ ctx[9]) + " svelte-pdmccs"));
    			add_location(img3, file$3, 57, 3, 1892);
    			attr_dev(section, "class", "background-container graph svelte-pdmccs");
    			add_render_callback(() => /*section_elementresize_handler*/ ctx[17].call(section));
    			add_location(section, file$3, 53, 2, 1540);
    			attr_dev(div, "slot", "background");
    			attr_dev(div, "class", "svelte-pdmccs");
    			add_location(div, file$3, 52, 2, 1514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			append_dev(section, img0);
    			append_dev(section, t0);
    			append_dev(section, img1);
    			append_dev(section, t1);
    			append_dev(section, img2);
    			append_dev(section, t2);
    			append_dev(section, img3);
    			section_resize_listener = add_resize_listener(section, /*section_elementresize_handler*/ ctx[17].bind(section));
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mlbHeightImgDsp*/ 64 && img0_class_value !== (img0_class_value = "" + (null_to_empty(/*mlbHeightImgDsp*/ ctx[6]) + " svelte-pdmccs"))) {
    				attr_dev(img0, "class", img0_class_value);
    			}

    			if (dirty & /*lmbHeightImgDsp*/ 128 && img1_class_value !== (img1_class_value = "" + (null_to_empty(/*lmbHeightImgDsp*/ ctx[7]) + " svelte-pdmccs"))) {
    				attr_dev(img1, "class", img1_class_value);
    			}

    			if (dirty & /*lidomHeightImgDsp*/ 256 && img2_class_value !== (img2_class_value = "" + (null_to_empty(/*lidomHeightImgDsp*/ ctx[8]) + " svelte-pdmccs"))) {
    				attr_dev(img2, "class", img2_class_value);
    			}

    			if (dirty & /*lidomHeightFtImgDsp*/ 512 && img3_class_value !== (img3_class_value = "" + (null_to_empty(/*lidomHeightFtImgDsp*/ ctx[9]) + " svelte-pdmccs"))) {
    				attr_dev(img3, "class", img3_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			section_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot$2.name,
    		type: "slot",
    		source: "(53:2) ",
    		ctx
    	});

    	return block;
    }

    // (62:2) 
    function create_foreground_slot$2(ctx) {
    	let div;
    	let section0;
    	let t0;
    	let section1;
    	let p0;
    	let t1;
    	let a0;
    	let t3;
    	let t4;
    	let section2;
    	let p1;
    	let t6;
    	let section3;
    	let p2;
    	let t8;
    	let section4;
    	let p3;
    	let t9;
    	let a1;
    	let t11;
    	let t12;
    	let section5;
    	let p4;
    	let t14;
    	let section6;
    	let p5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section0 = element("section");
    			t0 = space();
    			section1 = element("section");
    			p0 = element("p");
    			t1 = text("MLB, the top baseball league, provides fans with various statistics on ");
    			a0 = element("a");
    			a0.textContent = "Baseball Savant";
    			t3 = text(". Accurate data is based on “Sabermetrics”, which is statistical analysis.");
    			t4 = space();
    			section2 = element("section");
    			p1 = element("p");
    			p1.textContent = "The histogram of players’ height is proportional. MLB is known to conduct strict medical checks on players.";
    			t6 = space();
    			section3 = element("section");
    			p2 = element("p");
    			p2.textContent = "Seventy-four inches is the most frequent height among all 1550 MLB players. The shape is similar to a normal distribution which is proportional. MLB’s data helps detect other leagues’ cheats.";
    			t8 = space();
    			section4 = element("section");
    			p3 = element("p");
    			t9 = text("Mexican league (LMB) was affiliated with MLB before 2021. Minor League’s website provides ");
    			a1 = element("a");
    			a1.textContent = "LMB’s data";
    			t11 = text(". While the Mexican leaguer is shorter than the major leaguer, the histogram is also symmetrical.");
    			t12 = space();
    			section5 = element("section");
    			p4 = element("p");
    			p4.textContent = "The histogram of height in the Dominican League (LIDOM) has does not similar to MLB and LMB due to having two peaks.";
    			t14 = space();
    			section6 = element("section");
    			p5 = element("p");
    			p5.textContent = "The most frequent height is possible depending on the scale, feet and inch because 72 inches equals just six feet. The rescaled graph by feet and inches shows “6 feet hacking” is likely to exist.";
    			attr_dev(section0, "class", "section-zero svelte-pdmccs");
    			add_location(section0, file$3, 62, 4, 2061);
    			attr_dev(a0, "href", "https://baseballsavant.mlb.com/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			attr_dev(a0, "class", "svelte-pdmccs");
    			add_location(a0, file$3, 64, 100, 2216);
    			attr_dev(p0, "class", "paragraph svelte-pdmccs");
    			add_location(p0, file$3, 64, 8, 2124);
    			attr_dev(section1, "class", "svelte-pdmccs");
    			add_location(section1, file$3, 63, 4, 2106);
    			attr_dev(p1, "class", "paragraph svelte-pdmccs");
    			add_location(p1, file$3, 67, 3, 2430);
    			attr_dev(section2, "class", "svelte-pdmccs");
    			add_location(section2, file$3, 66, 4, 2417);
    			attr_dev(p2, "class", "paragraph svelte-pdmccs");
    			add_location(p2, file$3, 70, 8, 2600);
    			attr_dev(section3, "class", "svelte-pdmccs");
    			add_location(section3, file$3, 69, 4, 2582);
    			attr_dev(a1, "href", "https://www.milb.com/mexican/stats/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			attr_dev(a1, "class", "svelte-pdmccs");
    			add_location(a1, file$3, 73, 114, 2958);
    			attr_dev(p3, "class", "paragraph svelte-pdmccs");
    			add_location(p3, file$3, 73, 3, 2847);
    			attr_dev(section4, "class", "svelte-pdmccs");
    			add_location(section4, file$3, 72, 2, 2834);
    			attr_dev(p4, "class", "paragraph svelte-pdmccs");
    			add_location(p4, file$3, 76, 3, 3190);
    			attr_dev(section5, "class", "svelte-pdmccs");
    			add_location(section5, file$3, 75, 2, 3177);
    			attr_dev(p5, "class", "paragraph svelte-pdmccs");
    			add_location(p5, file$3, 79, 3, 3360);
    			attr_dev(section6, "class", "svelte-pdmccs");
    			add_location(section6, file$3, 78, 2, 3347);
    			attr_dev(div, "slot", "foreground");
    			attr_dev(div, "class", "svelte-pdmccs");
    			add_location(div, file$3, 61, 2, 2033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section0);
    			append_dev(div, t0);
    			append_dev(div, section1);
    			append_dev(section1, p0);
    			append_dev(p0, t1);
    			append_dev(p0, a0);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, section2);
    			append_dev(section2, p1);
    			append_dev(div, t6);
    			append_dev(div, section3);
    			append_dev(section3, p2);
    			append_dev(div, t8);
    			append_dev(div, section4);
    			append_dev(section4, p3);
    			append_dev(p3, t9);
    			append_dev(p3, a1);
    			append_dev(p3, t11);
    			append_dev(div, t12);
    			append_dev(div, section5);
    			append_dev(section5, p4);
    			append_dev(div, t14);
    			append_dev(div, section6);
    			append_dev(section6, p5);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot$2.name,
    		type: "slot",
    		source: "(62:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let scroller;
    	let updating_index;
    	let updating_offset;
    	let updating_progress;
    	let updating_count;
    	let current;

    	function scroller_index_binding(value) {
    		/*scroller_index_binding*/ ctx[18](value);
    	}

    	function scroller_offset_binding(value) {
    		/*scroller_offset_binding*/ ctx[19](value);
    	}

    	function scroller_progress_binding(value) {
    		/*scroller_progress_binding*/ ctx[20](value);
    	}

    	function scroller_count_binding(value) {
    		/*scroller_count_binding*/ ctx[21](value);
    	}

    	let scroller_props = {
    		top: /*top*/ ctx[14],
    		bottom: /*bottom*/ ctx[15],
    		threshold: /*threshold*/ ctx[16],
    		$$slots: {
    			foreground: [create_foreground_slot$2],
    			background: [create_background_slot$2]
    		},
    		$$scope: { ctx }
    	};

    	if (/*index*/ ctx[0] !== void 0) {
    		scroller_props.index = /*index*/ ctx[0];
    	}

    	if (/*offset*/ ctx[1] !== void 0) {
    		scroller_props.offset = /*offset*/ ctx[1];
    	}

    	if (/*progress*/ ctx[2] !== void 0) {
    		scroller_props.progress = /*progress*/ ctx[2];
    	}

    	if (/*count*/ ctx[3] !== void 0) {
    		scroller_props.count = /*count*/ ctx[3];
    	}

    	scroller = new Scroller({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, 'index', scroller_index_binding, /*index*/ ctx[0]));
    	binding_callbacks.push(() => bind(scroller, 'offset', scroller_offset_binding, /*offset*/ ctx[1]));
    	binding_callbacks.push(() => bind(scroller, 'progress', scroller_progress_binding, /*progress*/ ctx[2]));
    	binding_callbacks.push(() => bind(scroller, 'count', scroller_count_binding, /*count*/ ctx[3]));

    	const block = {
    		c: function create() {
    			create_component(scroller.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scroller, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, w, h, lidomHeightFtImgDsp, lidomHeightImgDsp, lmbHeightImgDsp, mlbHeightImgDsp*/ 4195312) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*index*/ 1) {
    				updating_index = true;
    				scroller_changes.index = /*index*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			if (!updating_offset && dirty & /*offset*/ 2) {
    				updating_offset = true;
    				scroller_changes.offset = /*offset*/ ctx[1];
    				add_flush_callback(() => updating_offset = false);
    			}

    			if (!updating_progress && dirty & /*progress*/ 4) {
    				updating_progress = true;
    				scroller_changes.progress = /*progress*/ ctx[2];
    				add_flush_callback(() => updating_progress = false);
    			}

    			if (!updating_count && dirty & /*count*/ 8) {
    				updating_count = true;
    				scroller_changes.count = /*count*/ ctx[3];
    				add_flush_callback(() => updating_count = false);
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scroller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollyAmericaHeight', slots, []);
    	let mlbHeightImg = './images/mlb_height.png';
    	let lmbHeightImg = './images/lmb_height.png';
    	let lidomHeightImg = './images/lidom_height.png';
    	let lidomHeightFtImg = './images/lidom_height_ft_highlight.png';

    	// Scroller parameters
    	let index; // int index of currently active foreground DOM element 

    	let offset; // float offset of currently active foreground DOM element - 0 to 1 value
    	let progress; // float how far along the whole scrolly we currently are - 0 to 1 value 
    	let count; // int total num steps (=DOM elements) of the foreground
    	let top = 0.1;
    	let bottom = 0.8;
    	let threshold = 0.5;

    	// So that we can pass the width and height of the container to the graph
    	let w;

    	let h;
    	let mlbHeightImgDsp;
    	let lmbHeightImgDsp;
    	let lidomHeightImgDsp;
    	let lidomHeightFtImgDsp;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollyAmericaHeight> was created with unknown prop '${key}'`);
    	});

    	function section_elementresize_handler() {
    		w = this.clientWidth;
    		h = this.clientHeight;
    		$$invalidate(4, w);
    		$$invalidate(5, h);
    	}

    	function scroller_index_binding(value) {
    		index = value;
    		$$invalidate(0, index);
    	}

    	function scroller_offset_binding(value) {
    		offset = value;
    		$$invalidate(1, offset);
    	}

    	function scroller_progress_binding(value) {
    		progress = value;
    		$$invalidate(2, progress);
    	}

    	function scroller_count_binding(value) {
    		count = value;
    		$$invalidate(3, count);
    	}

    	$$self.$capture_state = () => ({
    		Scroller,
    		mlbHeightImg,
    		lmbHeightImg,
    		lidomHeightImg,
    		lidomHeightFtImg,
    		index,
    		offset,
    		progress,
    		count,
    		top,
    		bottom,
    		threshold,
    		w,
    		h,
    		mlbHeightImgDsp,
    		lmbHeightImgDsp,
    		lidomHeightImgDsp,
    		lidomHeightFtImgDsp
    	});

    	$$self.$inject_state = $$props => {
    		if ('mlbHeightImg' in $$props) $$invalidate(10, mlbHeightImg = $$props.mlbHeightImg);
    		if ('lmbHeightImg' in $$props) $$invalidate(11, lmbHeightImg = $$props.lmbHeightImg);
    		if ('lidomHeightImg' in $$props) $$invalidate(12, lidomHeightImg = $$props.lidomHeightImg);
    		if ('lidomHeightFtImg' in $$props) $$invalidate(13, lidomHeightFtImg = $$props.lidomHeightFtImg);
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('offset' in $$props) $$invalidate(1, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(2, progress = $$props.progress);
    		if ('count' in $$props) $$invalidate(3, count = $$props.count);
    		if ('top' in $$props) $$invalidate(14, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(15, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(16, threshold = $$props.threshold);
    		if ('w' in $$props) $$invalidate(4, w = $$props.w);
    		if ('h' in $$props) $$invalidate(5, h = $$props.h);
    		if ('mlbHeightImgDsp' in $$props) $$invalidate(6, mlbHeightImgDsp = $$props.mlbHeightImgDsp);
    		if ('lmbHeightImgDsp' in $$props) $$invalidate(7, lmbHeightImgDsp = $$props.lmbHeightImgDsp);
    		if ('lidomHeightImgDsp' in $$props) $$invalidate(8, lidomHeightImgDsp = $$props.lidomHeightImgDsp);
    		if ('lidomHeightFtImgDsp' in $$props) $$invalidate(9, lidomHeightFtImgDsp = $$props.lidomHeightFtImgDsp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index*/ 1) {
    			if (index < 4) {
    				$$invalidate(6, mlbHeightImgDsp = "visible");
    				$$invalidate(7, lmbHeightImgDsp = "");
    				$$invalidate(8, lidomHeightImgDsp = "");
    				$$invalidate(9, lidomHeightFtImgDsp = "");
    			} else if (index == 4) {
    				$$invalidate(6, mlbHeightImgDsp = "");
    				$$invalidate(7, lmbHeightImgDsp = "visible");
    				$$invalidate(8, lidomHeightImgDsp = "");
    				$$invalidate(9, lidomHeightFtImgDsp = "");
    			} else if (index == 5) {
    				$$invalidate(6, mlbHeightImgDsp = "");
    				$$invalidate(7, lmbHeightImgDsp = "");
    				$$invalidate(8, lidomHeightImgDsp = "visible");
    				$$invalidate(9, lidomHeightFtImgDsp = "");
    			} else if (index > 5) {
    				$$invalidate(6, mlbHeightImgDsp = "");
    				$$invalidate(7, lmbHeightImgDsp = "");
    				$$invalidate(8, lidomHeightImgDsp = "");
    				$$invalidate(9, lidomHeightFtImgDsp = "visible");
    			}
    		}
    	};

    	return [
    		index,
    		offset,
    		progress,
    		count,
    		w,
    		h,
    		mlbHeightImgDsp,
    		lmbHeightImgDsp,
    		lidomHeightImgDsp,
    		lidomHeightFtImgDsp,
    		mlbHeightImg,
    		lmbHeightImg,
    		lidomHeightImg,
    		lidomHeightFtImg,
    		top,
    		bottom,
    		threshold,
    		section_elementresize_handler,
    		scroller_index_binding,
    		scroller_offset_binding,
    		scroller_progress_binding,
    		scroller_count_binding
    	];
    }

    class ScrollyAmericaHeight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollyAmericaHeight",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/ScrollyAsianHeight.svelte generated by Svelte v3.55.0 */
    const file$2 = "src/ScrollyAsianHeight.svelte";

    // (43:2) 
    function create_background_slot$1(ctx) {
    	let div;
    	let section;
    	let img0;
    	let img0_src_value;
    	let img0_class_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let img1_class_value;
    	let t1;
    	let img2;
    	let img2_src_value;
    	let img2_class_value;
    	let section_resize_listener;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section = element("section");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			img2 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*npbHeightImg*/ ctx[9])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "NPB's height histogram");
    			attr_dev(img0, "class", img0_class_value = "" + (null_to_empty(/*npbHeightImgDsp*/ ctx[6]) + " svelte-pdmccs"));
    			add_location(img0, file$2, 44, 3, 1329);
    			if (!src_url_equal(img1.src, img1_src_value = /*kboHeightImg*/ ctx[10])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "KBO's height histogram");
    			attr_dev(img1, "class", img1_class_value = "" + (null_to_empty(/*kboHeightImgDsp*/ ctx[7]) + " svelte-pdmccs"));
    			add_location(img1, file$2, 45, 3, 1414);
    			if (!src_url_equal(img2.src, img2_src_value = /*cpblHeightImg*/ ctx[11])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "CPBL's height histogram");
    			attr_dev(img2, "class", img2_class_value = "" + (null_to_empty(/*cpblHeightImgDsp*/ ctx[8]) + " svelte-pdmccs"));
    			add_location(img2, file$2, 46, 3, 1499);
    			attr_dev(section, "class", "background-container graph svelte-pdmccs");
    			add_render_callback(() => /*section_elementresize_handler*/ ctx[15].call(section));
    			add_location(section, file$2, 43, 2, 1238);
    			attr_dev(div, "slot", "background");
    			attr_dev(div, "class", "svelte-pdmccs");
    			add_location(div, file$2, 42, 2, 1212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			append_dev(section, img0);
    			append_dev(section, t0);
    			append_dev(section, img1);
    			append_dev(section, t1);
    			append_dev(section, img2);
    			section_resize_listener = add_resize_listener(section, /*section_elementresize_handler*/ ctx[15].bind(section));
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*npbHeightImgDsp*/ 64 && img0_class_value !== (img0_class_value = "" + (null_to_empty(/*npbHeightImgDsp*/ ctx[6]) + " svelte-pdmccs"))) {
    				attr_dev(img0, "class", img0_class_value);
    			}

    			if (dirty & /*kboHeightImgDsp*/ 128 && img1_class_value !== (img1_class_value = "" + (null_to_empty(/*kboHeightImgDsp*/ ctx[7]) + " svelte-pdmccs"))) {
    				attr_dev(img1, "class", img1_class_value);
    			}

    			if (dirty & /*cpblHeightImgDsp*/ 256 && img2_class_value !== (img2_class_value = "" + (null_to_empty(/*cpblHeightImgDsp*/ ctx[8]) + " svelte-pdmccs"))) {
    				attr_dev(img2, "class", img2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			section_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot$1.name,
    		type: "slot",
    		source: "(43:2) ",
    		ctx
    	});

    	return block;
    }

    // (51:2) 
    function create_foreground_slot$1(ctx) {
    	let div;
    	let section0;
    	let t0;
    	let section1;
    	let p0;
    	let t2;
    	let section2;
    	let p1;
    	let t4;
    	let section3;
    	let p2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section0 = element("section");
    			t0 = space();
    			section1 = element("section");
    			p0 = element("p");
    			p0.textContent = "The distribution of the Japanese league (NPB) has a suspicious point. The valley implies “180 cm hacking”. One hundred seventy-nine centimetres’ bar is unnaturally compared to 180 one.";
    			t2 = space();
    			section2 = element("section");
    			p1 = element("p");
    			p1.textContent = "Korean League’s (KBO) histogram is more suspicious than NPB’s. One hundred seventy-nine centimetres is few in the charts. The difference between 178 and 180 centimetres is likely evidence of cheating. Around 185 centimetres have the same characteristic.";
    			t4 = space();
    			section3 = element("section");
    			p2 = element("p");
    			p2.textContent = "The histogram of the Taiwan baseball league (CPBL) is unstable. There are some doubtful valleys between 170 and 190 centimetres. The difference between 179 and 180 centimetres is bold.";
    			attr_dev(section0, "class", "section-zero svelte-pdmccs");
    			add_location(section0, file$2, 51, 4, 1639);
    			attr_dev(p0, "class", "paragraph svelte-pdmccs");
    			add_location(p0, file$2, 53, 8, 1702);
    			attr_dev(section1, "class", "svelte-pdmccs");
    			add_location(section1, file$2, 52, 4, 1684);
    			attr_dev(p1, "class", "paragraph svelte-pdmccs");
    			add_location(p1, file$2, 56, 3, 1944);
    			attr_dev(section2, "class", "svelte-pdmccs");
    			add_location(section2, file$2, 55, 4, 1931);
    			attr_dev(p2, "class", "paragraph svelte-pdmccs");
    			add_location(p2, file$2, 59, 8, 2260);
    			attr_dev(section3, "class", "svelte-pdmccs");
    			add_location(section3, file$2, 58, 4, 2242);
    			attr_dev(div, "slot", "foreground");
    			attr_dev(div, "class", "svelte-pdmccs");
    			add_location(div, file$2, 50, 2, 1611);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section0);
    			append_dev(div, t0);
    			append_dev(div, section1);
    			append_dev(section1, p0);
    			append_dev(div, t2);
    			append_dev(div, section2);
    			append_dev(section2, p1);
    			append_dev(div, t4);
    			append_dev(div, section3);
    			append_dev(section3, p2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot$1.name,
    		type: "slot",
    		source: "(51:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let scroller;
    	let updating_index;
    	let updating_offset;
    	let updating_progress;
    	let updating_count;
    	let current;

    	function scroller_index_binding(value) {
    		/*scroller_index_binding*/ ctx[16](value);
    	}

    	function scroller_offset_binding(value) {
    		/*scroller_offset_binding*/ ctx[17](value);
    	}

    	function scroller_progress_binding(value) {
    		/*scroller_progress_binding*/ ctx[18](value);
    	}

    	function scroller_count_binding(value) {
    		/*scroller_count_binding*/ ctx[19](value);
    	}

    	let scroller_props = {
    		top: /*top*/ ctx[12],
    		bottom: /*bottom*/ ctx[13],
    		threshold: /*threshold*/ ctx[14],
    		$$slots: {
    			foreground: [create_foreground_slot$1],
    			background: [create_background_slot$1]
    		},
    		$$scope: { ctx }
    	};

    	if (/*index*/ ctx[0] !== void 0) {
    		scroller_props.index = /*index*/ ctx[0];
    	}

    	if (/*offset*/ ctx[1] !== void 0) {
    		scroller_props.offset = /*offset*/ ctx[1];
    	}

    	if (/*progress*/ ctx[2] !== void 0) {
    		scroller_props.progress = /*progress*/ ctx[2];
    	}

    	if (/*count*/ ctx[3] !== void 0) {
    		scroller_props.count = /*count*/ ctx[3];
    	}

    	scroller = new Scroller({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, 'index', scroller_index_binding, /*index*/ ctx[0]));
    	binding_callbacks.push(() => bind(scroller, 'offset', scroller_offset_binding, /*offset*/ ctx[1]));
    	binding_callbacks.push(() => bind(scroller, 'progress', scroller_progress_binding, /*progress*/ ctx[2]));
    	binding_callbacks.push(() => bind(scroller, 'count', scroller_count_binding, /*count*/ ctx[3]));

    	const block = {
    		c: function create() {
    			create_component(scroller.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scroller, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, w, h, cpblHeightImgDsp, kboHeightImgDsp, npbHeightImgDsp*/ 1049072) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*index*/ 1) {
    				updating_index = true;
    				scroller_changes.index = /*index*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			if (!updating_offset && dirty & /*offset*/ 2) {
    				updating_offset = true;
    				scroller_changes.offset = /*offset*/ ctx[1];
    				add_flush_callback(() => updating_offset = false);
    			}

    			if (!updating_progress && dirty & /*progress*/ 4) {
    				updating_progress = true;
    				scroller_changes.progress = /*progress*/ ctx[2];
    				add_flush_callback(() => updating_progress = false);
    			}

    			if (!updating_count && dirty & /*count*/ 8) {
    				updating_count = true;
    				scroller_changes.count = /*count*/ ctx[3];
    				add_flush_callback(() => updating_count = false);
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scroller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollyAsianHeight', slots, []);
    	let npbHeightImg = './images/npb_height_anno.png';
    	let kboHeightImg = './images/kbo_height_anno.png';
    	let cpblHeightImg = './images/cpbl_height_anno.png';

    	// Scroller parameters
    	let index; // int index of currently active foreground DOM element 

    	let offset; // float offset of currently active foreground DOM element - 0 to 1 value
    	let progress; // float how far along the whole scrolly we currently are - 0 to 1 value 
    	let count; // int total num steps (=DOM elements) of the foreground
    	let top = 0.1;
    	let bottom = 0.8;
    	let threshold = 0.5;

    	// So that we can pass the width and height of the container to the graph
    	let w;

    	let h;
    	let npbHeightImgDsp;
    	let kboHeightImgDsp;
    	let cpblHeightImgDsp;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollyAsianHeight> was created with unknown prop '${key}'`);
    	});

    	function section_elementresize_handler() {
    		w = this.clientWidth;
    		h = this.clientHeight;
    		$$invalidate(4, w);
    		$$invalidate(5, h);
    	}

    	function scroller_index_binding(value) {
    		index = value;
    		$$invalidate(0, index);
    	}

    	function scroller_offset_binding(value) {
    		offset = value;
    		$$invalidate(1, offset);
    	}

    	function scroller_progress_binding(value) {
    		progress = value;
    		$$invalidate(2, progress);
    	}

    	function scroller_count_binding(value) {
    		count = value;
    		$$invalidate(3, count);
    	}

    	$$self.$capture_state = () => ({
    		Scroller,
    		npbHeightImg,
    		kboHeightImg,
    		cpblHeightImg,
    		index,
    		offset,
    		progress,
    		count,
    		top,
    		bottom,
    		threshold,
    		w,
    		h,
    		npbHeightImgDsp,
    		kboHeightImgDsp,
    		cpblHeightImgDsp
    	});

    	$$self.$inject_state = $$props => {
    		if ('npbHeightImg' in $$props) $$invalidate(9, npbHeightImg = $$props.npbHeightImg);
    		if ('kboHeightImg' in $$props) $$invalidate(10, kboHeightImg = $$props.kboHeightImg);
    		if ('cpblHeightImg' in $$props) $$invalidate(11, cpblHeightImg = $$props.cpblHeightImg);
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('offset' in $$props) $$invalidate(1, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(2, progress = $$props.progress);
    		if ('count' in $$props) $$invalidate(3, count = $$props.count);
    		if ('top' in $$props) $$invalidate(12, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(13, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(14, threshold = $$props.threshold);
    		if ('w' in $$props) $$invalidate(4, w = $$props.w);
    		if ('h' in $$props) $$invalidate(5, h = $$props.h);
    		if ('npbHeightImgDsp' in $$props) $$invalidate(6, npbHeightImgDsp = $$props.npbHeightImgDsp);
    		if ('kboHeightImgDsp' in $$props) $$invalidate(7, kboHeightImgDsp = $$props.kboHeightImgDsp);
    		if ('cpblHeightImgDsp' in $$props) $$invalidate(8, cpblHeightImgDsp = $$props.cpblHeightImgDsp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index*/ 1) {
    			if (index < 2) {
    				$$invalidate(6, npbHeightImgDsp = "visible");
    				$$invalidate(7, kboHeightImgDsp = "");
    				$$invalidate(8, cpblHeightImgDsp = "");
    			} else if (index == 2) {
    				$$invalidate(6, npbHeightImgDsp = "");
    				$$invalidate(7, kboHeightImgDsp = "visible");
    				$$invalidate(8, cpblHeightImgDsp = "");
    			} else if (index > 2) {
    				$$invalidate(6, npbHeightImgDsp = "");
    				$$invalidate(7, kboHeightImgDsp = "");
    				$$invalidate(8, cpblHeightImgDsp = "visible");
    			}
    		}
    	};

    	return [
    		index,
    		offset,
    		progress,
    		count,
    		w,
    		h,
    		npbHeightImgDsp,
    		kboHeightImgDsp,
    		cpblHeightImgDsp,
    		npbHeightImg,
    		kboHeightImg,
    		cpblHeightImg,
    		top,
    		bottom,
    		threshold,
    		section_elementresize_handler,
    		scroller_index_binding,
    		scroller_offset_binding,
    		scroller_progress_binding,
    		scroller_count_binding
    	];
    }

    class ScrollyAsianHeight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollyAsianHeight",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/ScrollyAsianWeight.svelte generated by Svelte v3.55.0 */
    const file$1 = "src/ScrollyAsianWeight.svelte";

    // (43:2) 
    function create_background_slot(ctx) {
    	let div;
    	let section;
    	let img0;
    	let img0_src_value;
    	let img0_class_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let img1_class_value;
    	let t1;
    	let img2;
    	let img2_src_value;
    	let img2_class_value;
    	let section_resize_listener;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section = element("section");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			img2 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*npbWeightImg*/ ctx[9])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "NPB's weight hitogram");
    			attr_dev(img0, "class", img0_class_value = "" + (null_to_empty(/*npbWeightImgDsp*/ ctx[6]) + " svelte-pdmccs"));
    			add_location(img0, file$1, 44, 3, 1329);
    			if (!src_url_equal(img1.src, img1_src_value = /*kboWeightImg*/ ctx[10])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "KBO's weight histogram");
    			attr_dev(img1, "class", img1_class_value = "" + (null_to_empty(/*kboWeightImgDsp*/ ctx[7]) + " svelte-pdmccs"));
    			add_location(img1, file$1, 45, 3, 1413);
    			if (!src_url_equal(img2.src, img2_src_value = /*cpblWeightImg*/ ctx[11])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "CPBL's weight histogram");
    			attr_dev(img2, "class", img2_class_value = "" + (null_to_empty(/*cpblWeightImgDsp*/ ctx[8]) + " svelte-pdmccs"));
    			add_location(img2, file$1, 46, 3, 1498);
    			attr_dev(section, "class", "background-container graph svelte-pdmccs");
    			add_render_callback(() => /*section_elementresize_handler*/ ctx[15].call(section));
    			add_location(section, file$1, 43, 2, 1238);
    			attr_dev(div, "slot", "background");
    			attr_dev(div, "class", "svelte-pdmccs");
    			add_location(div, file$1, 42, 2, 1212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			append_dev(section, img0);
    			append_dev(section, t0);
    			append_dev(section, img1);
    			append_dev(section, t1);
    			append_dev(section, img2);
    			section_resize_listener = add_resize_listener(section, /*section_elementresize_handler*/ ctx[15].bind(section));
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*npbWeightImgDsp*/ 64 && img0_class_value !== (img0_class_value = "" + (null_to_empty(/*npbWeightImgDsp*/ ctx[6]) + " svelte-pdmccs"))) {
    				attr_dev(img0, "class", img0_class_value);
    			}

    			if (dirty & /*kboWeightImgDsp*/ 128 && img1_class_value !== (img1_class_value = "" + (null_to_empty(/*kboWeightImgDsp*/ ctx[7]) + " svelte-pdmccs"))) {
    				attr_dev(img1, "class", img1_class_value);
    			}

    			if (dirty & /*cpblWeightImgDsp*/ 256 && img2_class_value !== (img2_class_value = "" + (null_to_empty(/*cpblWeightImgDsp*/ ctx[8]) + " svelte-pdmccs"))) {
    				attr_dev(img2, "class", img2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			section_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot.name,
    		type: "slot",
    		source: "(43:2) ",
    		ctx
    	});

    	return block;
    }

    // (51:2) 
    function create_foreground_slot(ctx) {
    	let div;
    	let section0;
    	let t0;
    	let section1;
    	let p0;
    	let t2;
    	let section2;
    	let p1;
    	let t4;
    	let section3;
    	let p2;
    	let t6;
    	let section4;
    	let p3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section0 = element("section");
    			t0 = space();
    			section1 = element("section");
    			p0 = element("p");
    			p0.textContent = "The weight is more unstable than height. Asian players tell a lie about height too. Japanese players tend to tell their height in five-centimetre increments.";
    			t2 = space();
    			section2 = element("section");
    			p1 = element("p");
    			p1.textContent = "The five multiple heights, 75, 80, 85, 90, 95, and 100, are relatively many. Around 90 kilograms is strange in the frequency graph.";
    			t4 = space();
    			section3 = element("section");
    			p2 = element("p");
    			p2.textContent = "The neighbour country Korea has a similar pattern. The peaks are comprised of the five multiple weights. The nine multiple weights are apparently few.";
    			t6 = space();
    			section4 = element("section");
    			p3 = element("p");
    			p3.textContent = "The five multiple patterns exist obviously in the Taiwan league too. The three significant peaks are 70, 80, and 90. Taiwanese players are likely to have lied, as well as Japanese and Korean. Weight is also highly possible to be the object of a lie.";
    			attr_dev(section0, "class", "section-zero svelte-pdmccs");
    			add_location(section0, file$1, 51, 4, 1638);
    			attr_dev(p0, "class", "paragraph svelte-pdmccs");
    			add_location(p0, file$1, 53, 8, 1701);
    			attr_dev(section1, "class", "svelte-pdmccs");
    			add_location(section1, file$1, 52, 4, 1683);
    			attr_dev(p1, "class", "paragraph svelte-pdmccs");
    			add_location(p1, file$1, 56, 3, 1916);
    			attr_dev(section2, "class", "svelte-pdmccs");
    			add_location(section2, file$1, 55, 4, 1903);
    			attr_dev(p2, "class", "paragraph svelte-pdmccs");
    			add_location(p2, file$1, 59, 8, 2110);
    			attr_dev(section3, "class", "svelte-pdmccs");
    			add_location(section3, file$1, 58, 4, 2092);
    			attr_dev(p3, "class", "paragraph svelte-pdmccs");
    			add_location(p3, file$1, 62, 3, 2316);
    			attr_dev(section4, "class", "svelte-pdmccs");
    			add_location(section4, file$1, 61, 2, 2303);
    			attr_dev(div, "slot", "foreground");
    			attr_dev(div, "class", "svelte-pdmccs");
    			add_location(div, file$1, 50, 2, 1610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section0);
    			append_dev(div, t0);
    			append_dev(div, section1);
    			append_dev(section1, p0);
    			append_dev(div, t2);
    			append_dev(div, section2);
    			append_dev(section2, p1);
    			append_dev(div, t4);
    			append_dev(div, section3);
    			append_dev(section3, p2);
    			append_dev(div, t6);
    			append_dev(div, section4);
    			append_dev(section4, p3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot.name,
    		type: "slot",
    		source: "(51:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let scroller;
    	let updating_index;
    	let updating_offset;
    	let updating_progress;
    	let updating_count;
    	let current;

    	function scroller_index_binding(value) {
    		/*scroller_index_binding*/ ctx[16](value);
    	}

    	function scroller_offset_binding(value) {
    		/*scroller_offset_binding*/ ctx[17](value);
    	}

    	function scroller_progress_binding(value) {
    		/*scroller_progress_binding*/ ctx[18](value);
    	}

    	function scroller_count_binding(value) {
    		/*scroller_count_binding*/ ctx[19](value);
    	}

    	let scroller_props = {
    		top: /*top*/ ctx[12],
    		bottom: /*bottom*/ ctx[13],
    		threshold: /*threshold*/ ctx[14],
    		$$slots: {
    			foreground: [create_foreground_slot],
    			background: [create_background_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*index*/ ctx[0] !== void 0) {
    		scroller_props.index = /*index*/ ctx[0];
    	}

    	if (/*offset*/ ctx[1] !== void 0) {
    		scroller_props.offset = /*offset*/ ctx[1];
    	}

    	if (/*progress*/ ctx[2] !== void 0) {
    		scroller_props.progress = /*progress*/ ctx[2];
    	}

    	if (/*count*/ ctx[3] !== void 0) {
    		scroller_props.count = /*count*/ ctx[3];
    	}

    	scroller = new Scroller({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, 'index', scroller_index_binding, /*index*/ ctx[0]));
    	binding_callbacks.push(() => bind(scroller, 'offset', scroller_offset_binding, /*offset*/ ctx[1]));
    	binding_callbacks.push(() => bind(scroller, 'progress', scroller_progress_binding, /*progress*/ ctx[2]));
    	binding_callbacks.push(() => bind(scroller, 'count', scroller_count_binding, /*count*/ ctx[3]));

    	const block = {
    		c: function create() {
    			create_component(scroller.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scroller, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, w, h, cpblWeightImgDsp, kboWeightImgDsp, npbWeightImgDsp*/ 1049072) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_index && dirty & /*index*/ 1) {
    				updating_index = true;
    				scroller_changes.index = /*index*/ ctx[0];
    				add_flush_callback(() => updating_index = false);
    			}

    			if (!updating_offset && dirty & /*offset*/ 2) {
    				updating_offset = true;
    				scroller_changes.offset = /*offset*/ ctx[1];
    				add_flush_callback(() => updating_offset = false);
    			}

    			if (!updating_progress && dirty & /*progress*/ 4) {
    				updating_progress = true;
    				scroller_changes.progress = /*progress*/ ctx[2];
    				add_flush_callback(() => updating_progress = false);
    			}

    			if (!updating_count && dirty & /*count*/ 8) {
    				updating_count = true;
    				scroller_changes.count = /*count*/ ctx[3];
    				add_flush_callback(() => updating_count = false);
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scroller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollyAsianWeight', slots, []);
    	let npbWeightImg = './images/npb_weight_anno.png';
    	let kboWeightImg = './images/kbo_weight_anno.png';
    	let cpblWeightImg = './images/cpbl_weight_anno.png';

    	// Scroller parameters
    	let index; // int index of currently active foreground DOM element 

    	let offset; // float offset of currently active foreground DOM element - 0 to 1 value
    	let progress; // float how far along the whole scrolly we currently are - 0 to 1 value 
    	let count; // int total num steps (=DOM elements) of the foreground
    	let top = 0.1;
    	let bottom = 0.8;
    	let threshold = 0.5;

    	// So that we can pass the width and height of the container to the graph
    	let w;

    	let h;
    	let npbWeightImgDsp;
    	let kboWeightImgDsp;
    	let cpblWeightImgDsp;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollyAsianWeight> was created with unknown prop '${key}'`);
    	});

    	function section_elementresize_handler() {
    		w = this.clientWidth;
    		h = this.clientHeight;
    		$$invalidate(4, w);
    		$$invalidate(5, h);
    	}

    	function scroller_index_binding(value) {
    		index = value;
    		$$invalidate(0, index);
    	}

    	function scroller_offset_binding(value) {
    		offset = value;
    		$$invalidate(1, offset);
    	}

    	function scroller_progress_binding(value) {
    		progress = value;
    		$$invalidate(2, progress);
    	}

    	function scroller_count_binding(value) {
    		count = value;
    		$$invalidate(3, count);
    	}

    	$$self.$capture_state = () => ({
    		Scroller,
    		npbWeightImg,
    		kboWeightImg,
    		cpblWeightImg,
    		index,
    		offset,
    		progress,
    		count,
    		top,
    		bottom,
    		threshold,
    		w,
    		h,
    		npbWeightImgDsp,
    		kboWeightImgDsp,
    		cpblWeightImgDsp
    	});

    	$$self.$inject_state = $$props => {
    		if ('npbWeightImg' in $$props) $$invalidate(9, npbWeightImg = $$props.npbWeightImg);
    		if ('kboWeightImg' in $$props) $$invalidate(10, kboWeightImg = $$props.kboWeightImg);
    		if ('cpblWeightImg' in $$props) $$invalidate(11, cpblWeightImg = $$props.cpblWeightImg);
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('offset' in $$props) $$invalidate(1, offset = $$props.offset);
    		if ('progress' in $$props) $$invalidate(2, progress = $$props.progress);
    		if ('count' in $$props) $$invalidate(3, count = $$props.count);
    		if ('top' in $$props) $$invalidate(12, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(13, bottom = $$props.bottom);
    		if ('threshold' in $$props) $$invalidate(14, threshold = $$props.threshold);
    		if ('w' in $$props) $$invalidate(4, w = $$props.w);
    		if ('h' in $$props) $$invalidate(5, h = $$props.h);
    		if ('npbWeightImgDsp' in $$props) $$invalidate(6, npbWeightImgDsp = $$props.npbWeightImgDsp);
    		if ('kboWeightImgDsp' in $$props) $$invalidate(7, kboWeightImgDsp = $$props.kboWeightImgDsp);
    		if ('cpblWeightImgDsp' in $$props) $$invalidate(8, cpblWeightImgDsp = $$props.cpblWeightImgDsp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index*/ 1) {
    			if (index < 3) {
    				$$invalidate(6, npbWeightImgDsp = "visible");
    				$$invalidate(7, kboWeightImgDsp = "");
    				$$invalidate(8, cpblWeightImgDsp = "");
    			} else if (index == 3) {
    				$$invalidate(6, npbWeightImgDsp = "");
    				$$invalidate(7, kboWeightImgDsp = "visible");
    				$$invalidate(8, cpblWeightImgDsp = "");
    			} else if (index > 3) {
    				$$invalidate(6, npbWeightImgDsp = "");
    				$$invalidate(7, kboWeightImgDsp = "");
    				$$invalidate(8, cpblWeightImgDsp = "visible");
    			}
    		}
    	};

    	return [
    		index,
    		offset,
    		progress,
    		count,
    		w,
    		h,
    		npbWeightImgDsp,
    		kboWeightImgDsp,
    		cpblWeightImgDsp,
    		npbWeightImg,
    		kboWeightImg,
    		cpblWeightImg,
    		top,
    		bottom,
    		threshold,
    		section_elementresize_handler,
    		scroller_index_binding,
    		scroller_offset_binding,
    		scroller_progress_binding,
    		scroller_count_binding
    	];
    }

    class ScrollyAsianWeight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollyAsianWeight",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let span;
    	let t1;
    	let h1;
    	let t3;
    	let h4;
    	let t5;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let div1;
    	let t8;
    	let div3;
    	let t10;
    	let p0;
    	let t12;
    	let scrollyamericaheight;
    	let t13;
    	let p1;
    	let t15;
    	let div4;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let p2;
    	let t18;
    	let h20;
    	let t20;
    	let p3;
    	let t22;
    	let p4;
    	let t24;
    	let div5;
    	let img2;
    	let img2_src_value;
    	let t25;
    	let p5;
    	let t27;
    	let p6;
    	let t28;
    	let a0;
    	let t30;
    	let t31;
    	let p7;
    	let t32;
    	let a1;
    	let t34;
    	let a2;
    	let t36;
    	let t37;
    	let p8;
    	let t38;
    	let a3;
    	let t40;
    	let a4;
    	let t42;
    	let t43;
    	let div7;
    	let img3;
    	let img3_src_value;
    	let t44;
    	let div6;
    	let t46;
    	let p9;
    	let t48;
    	let p10;
    	let t50;
    	let p11;
    	let t52;
    	let div9;
    	let img4;
    	let img4_src_value;
    	let t53;
    	let div8;
    	let t55;
    	let p12;
    	let t57;
    	let p13;
    	let t59;
    	let h21;
    	let t61;
    	let p14;
    	let t63;
    	let p15;
    	let t65;
    	let p16;
    	let t67;
    	let scrollyasianheight;
    	let t68;
    	let h22;
    	let t70;
    	let p17;
    	let t72;
    	let p18;
    	let t73;
    	let a5;
    	let t75;
    	let t76;
    	let div11;
    	let img5;
    	let img5_src_value;
    	let t77;
    	let div10;
    	let t79;
    	let p19;
    	let t80;
    	let a6;
    	let t82;
    	let t83;
    	let p20;
    	let t84;
    	let a7;
    	let t86;
    	let t87;
    	let div13;
    	let img6;
    	let img6_src_value;
    	let t88;
    	let div12;
    	let t90;
    	let h23;
    	let t92;
    	let p21;
    	let t94;
    	let p22;
    	let t96;
    	let scrollyasianweight;
    	let t97;
    	let h24;
    	let t99;
    	let p23;
    	let t100;
    	let a8;
    	let t102;
    	let t103;
    	let p24;
    	let t105;
    	let div15;
    	let img7;
    	let img7_src_value;
    	let t106;
    	let div14;
    	let t108;
    	let p25;
    	let t109;
    	let a9;
    	let t111;
    	let a10;
    	let t113;
    	let t114;
    	let p26;
    	let t116;
    	let div17;
    	let img8;
    	let img8_src_value;
    	let t117;
    	let div16;
    	let t119;
    	let p27;
    	let t121;
    	let h25;
    	let t123;
    	let p28;
    	let t124;
    	let a11;
    	let t126;
    	let t127;
    	let p29;
    	let t129;
    	let div18;
    	let blockquote;
    	let p30;
    	let t130;
    	let a12;
    	let t132;
    	let a13;
    	let t134;
    	let a14;
    	let t136;
    	let a15;
    	let t138;
    	let script;
    	let script_src_value;
    	let t139;
    	let p31;
    	let t140;
    	let a16;
    	let t142;
    	let t143;
    	let p32;
    	let t145;
    	let div19;
    	let current;
    	scrollyamericaheight = new ScrollyAmericaHeight({ $$inline: true });
    	scrollyasianheight = new ScrollyAsianHeight({ $$inline: true });
    	scrollyasianweight = new ScrollyAsianWeight({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Data analysis";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "\"6 feet hacking\"";
    			t3 = space();
    			h4 = element("h4");
    			h4.textContent = "Professional baseball player's lies about height and weight";
    			t5 = space();
    			div2 = element("div");
    			img0 = element("img");
    			t6 = space();
    			div1 = element("div");
    			div1.textContent = "MLB's players information look accurate according to the histogram ©MLB";
    			t8 = space();
    			div3 = element("div");
    			div3.textContent = "Professional baseball player in four countries is likely to tell lies about their hight and weight, according to data from each league's website.";
    			t10 = space();
    			p0 = element("p");
    			p0.textContent = "Sports players are required fair play. The histogram is simple graph which presents frequency. However, the histograms of height and weight imply professional baseball players' lies, unnatural distribution.";
    			t12 = space();
    			create_component(scrollyamericaheight.$$.fragment);
    			t13 = space();
    			p1 = element("p");
    			p1.textContent = "There is a bias known as “p-hacking” in statistics. Under 1.96 z-statistic is supported to be a significant value in statistics. The below graphs presented by economists in 2016 imply the existence of a suspicious peak around 1.96 in economics papers.";
    			t15 = space();
    			div4 = element("div");
    			img1 = element("img");
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "Some of the six feet players are highly likely to have lied about their height. Six feet may be a significant height for a professional baseball player, as well as z-statistics 1.96 for an academician.";
    			t18 = space();
    			h20 = element("h2");
    			h20.textContent = "Inaccurate Dominicans' data";
    			t20 = space();
    			p3 = element("p");
    			p3.textContent = "Dominican players also play in Minor League. The league below MLB has the same players’ data. Minor League’s data is closer to a norm distribution than LIDOM’s.";
    			t22 = space();
    			p4 = element("p");
    			p4.textContent = "However, the shape of the histogram is suspicious. The Minor’s bars also represent an unnatural valley in the middle.";
    			t24 = space();
    			div5 = element("div");
    			img2 = element("img");
    			t25 = space();
    			p5 = element("p");
    			p5.textContent = "The data about the Dominicans have inaccurate numbers regardless of the organisations which provide it.";
    			t27 = space();
    			p6 = element("p");
    			t28 = text("Fifty-one pounds (5 feet 1 inch) players are outlier numbers. The number on ");
    			a0 = element("a");
    			a0.textContent = "LIDOM’s website";
    			t30 = text(" is likely wrong because Minor League’s website says they’re 5 feet 10 or 11 inches.");
    			t31 = space();
    			p7 = element("p");
    			t32 = text("Frank Garces is five feet one inch on ");
    			a1 = element("a");
    			a1.textContent = "the LIDOM website";
    			t34 = text(". But he is five feet 11 inches on ");
    			a2 = element("a");
    			a2.textContent = "the MiLB website";
    			t36 = text(". The league is presumed to omit the end of “0” or “1”.");
    			t37 = space();
    			p8 = element("p");
    			t38 = text("On the other hand, Emailin Montilla’s height was written as four feet four inches by ");
    			a3 = element("a");
    			a3.textContent = "the Minor League website";
    			t40 = text(". He is six feet four feet, according to ");
    			a4 = element("a");
    			a4.textContent = "the LIDOM website";
    			t42 = text(".");
    			t43 = space();
    			div7 = element("div");
    			img3 = element("img");
    			t44 = space();
    			div6 = element("div");
    			div6.textContent = "Melky Cabrera’s birthday was born on August 11th 1984, according to the Minor League website ©MiLB";
    			t46 = space();
    			p9 = element("p");
    			p9.textContent = "Eight out of 276 LIDOM players’ birthday are different between LDIOM and Minor website because their birth month and day is reversed.";
    			t48 = space();
    			p10 = element("p");
    			p10.textContent = "While Dominicans write dates in the order of the day, month and year, Americans write dates in the sequence of the month, day and year.";
    			t50 = space();
    			p11 = element("p");
    			p11.textContent = "The same order of numbers mean that the either one is a mistake.";
    			t52 = space();
    			div9 = element("div");
    			img4 = element("img");
    			t53 = space();
    			div8 = element("div");
    			div8.textContent = "Melky Cabrera’s birthday is the eighth of November 1984 on the Dominican league website ©LDOM";
    			t55 = space();
    			p12 = element("p");
    			p12.textContent = "Twelve players whose birthplace is the same or very close between LIDOM and MiLB data are written different birthdays from a few days to a year. The difference may be caused by poor record management too.";
    			t57 = space();
    			p13 = element("p");
    			p13.textContent = "In fact, Carlos Martínez’s contract with MLB has been postponed for a year due to a different name and birthday based on poor record keeping in 2009.";
    			t59 = space();
    			h21 = element("h2");
    			h21.textContent = "“180 cm hacking” in Asia";
    			t61 = space();
    			p14 = element("p");
    			p14.textContent = "The trend is not only Dominican league but also in Asian leagues. Their height graphs show the same pattern as the Dominican one.";
    			t63 = space();
    			p15 = element("p");
    			p15.textContent = "“180 cm hacking” is likely to exist in Asian professional baseball. Centimetre scale is smaller than inch one. One inch is 2.54 centimetres.";
    			t65 = space();
    			p16 = element("p");
    			p16.textContent = "Additionally, the scale that combines feet with inches is duodecimal, but the metre scale is decimal. This difference causes further hacking.";
    			t67 = space();
    			create_component(scrollyasianheight.$$.fragment);
    			t68 = space();
    			h22 = element("h2");
    			h22.textContent = "Who is the tallest?";
    			t70 = space();
    			p17 = element("p");
    			p17.textContent = "Doubting data makes it difficult to know who is the tallest.";
    			t72 = space();
    			p18 = element("p");
    			t73 = text("Brock DYKXHOORN, who plays in Taiwan, is one of the tallest players among the six prime leagues in 205 centimetres (6 feet 9 inches) according to ");
    			a5 = element("a");
    			a5.textContent = "the CPBL website";
    			t75 = text(".");
    			t76 = space();
    			div11 = element("div");
    			img5 = element("img");
    			t77 = space();
    			div10 = element("div");
    			div10.textContent = "Brock DYKXHOORN is 205 cm (6' 9\") according to CPBL website ©CPBL (Taiwan)";
    			t79 = space();
    			p19 = element("p");
    			t80 = text("However, ");
    			a6 = element("a");
    			a6.textContent = "the Minor League website";
    			t82 = text(" explains that the tall man is 6 feet 8 inches (203.2 centimetres).");
    			t83 = space();
    			p20 = element("p");
    			t84 = text("As Asian leagues are presumed to provide fans with inaccurate data, it is difficult to judge if he is honest and the tallest player. He played in Korea too, and ");
    			a7 = element("a");
    			a7.textContent = "the KBO website";
    			t86 = text(" says he is 205 centimetres.");
    			t87 = space();
    			div13 = element("div");
    			img6 = element("img");
    			t88 = space();
    			div12 = element("div");
    			div12.textContent = "Brock Dykxhoorn is 6 feet 9 inches (203.2 cm) according to the MLB website © MiLB";
    			t90 = space();
    			h23 = element("h2");
    			h23.textContent = "The hacking also exists in weight";
    			t92 = space();
    			p21 = element("p");
    			p21.textContent = "The histogram of weight is more wobbly than the height one. Asian leagues’ histogram shows a doubtful distribution.";
    			t94 = space();
    			p22 = element("p");
    			p22.textContent = "On the other hand, the American continental league adopts the pound (lb) scale, which is finer than a kilogram. Thus their histogram is useless for detecting players’ lies.";
    			t96 = space();
    			create_component(scrollyasianweight.$$.fragment);
    			t97 = space();
    			h24 = element("h2");
    			h24.textContent = "Legend's self-reported weight";
    			t99 = space();
    			p23 = element("p");
    			t100 = text("LEE Dae Ho, who retired from KBO at the end of the 2022 season, is the heaviest player among six prime leagues, according to ");
    			a8 = element("a");
    			a8.textContent = "data from the KBO website";
    			t102 = text(".");
    			t103 = space();
    			p24 = element("p");
    			p24.textContent = "The Korean Olympic gold medalist also played in NPB and MLB.";
    			t105 = space();
    			div15 = element("div");
    			img7 = element("img");
    			t106 = space();
    			div14 = element("div");
    			div14.textContent = "LEE Dae Ho is the heaviest at 130 kg (286.6 pounds) according to the KBO website ©KBO";
    			t108 = space();
    			p25 = element("p");
    			t109 = text("His weight is 130 kg (286.6 pounds) on KBO and ");
    			a9 = element("a");
    			a9.textContent = "NPB websites";
    			t111 = text(". But ");
    			a10 = element("a");
    			a10.textContent = "MLB.com says";
    			t113 = text(" that he is 113.4 kg (250 pounds). The difference is 16.6 kg (26.6 pounds).");
    			t114 = space();
    			p26 = element("p");
    			p26.textContent = "Although his self-proclaimed weight is 130 kg, his actual weight is estimated at around 113.4 kg after 2016, when he contracted with Seattle Mariners at 33.";
    			t116 = space();
    			div17 = element("div");
    			img8 = element("img");
    			t117 = space();
    			div16 = element("div");
    			div16.textContent = "MLB website says Dae-Ho Lee is 250 pounds (113.4 kg) ©MLB";
    			t119 = space();
    			p27 = element("p");
    			p27.textContent = "The height and weight histogram are generally close to normal distribution like MLB one. But the four leagues’ histograms are different from a normal distribution. Comparison with MLB and LMB illuminates the height and weight hacking in other leagues.";
    			t121 = space();
    			h25 = element("h2");
    			h25.textContent = "Tracking system and Olympic Charter";
    			t123 = space();
    			p28 = element("p");
    			t124 = text("Statistics reveal their cheats. In addition, the tracking systems, such as ");
    			a11 = element("a");
    			a11.textContent = "Hawk-Eye";
    			t126 = text(", which is used in FIFA World Cup for VAR, record players’ moves in millimetres units.");
    			t127 = space();
    			p29 = element("p");
    			p29.textContent = "Though baseball is not a class system sport, professional players should not fudge a few centimetres to sports fans. Leagues also should provide supporters with accurate data.";
    			t129 = space();
    			div18 = element("div");
    			blockquote = element("blockquote");
    			p30 = element("p");
    			t130 = text("The future is here... Pose tracking technology will create the next baseball data revolution. Check out this article by ");
    			a12 = element("a");
    			a12.textContent = "@mike_petriello";
    			t132 = text(". Amazing.");
    			a13 = element("a");
    			a13.textContent = "https://t.co/uFZYwX4e5z";
    			t134 = space();
    			a14 = element("a");
    			a14.textContent = "pic.twitter.com/GXMkug7JHp";
    			t136 = text("— Daren Willman (@darenw) ");
    			a15 = element("a");
    			a15.textContent = "October 25, 2020";
    			t138 = space();
    			script = element("script");
    			t139 = space();
    			p31 = element("p");
    			t140 = text("Baseball was the Olympic sport in Tokyo 2020, and Japan and the Dominica Republic won medals. ");
    			a16 = element("a");
    			a16.textContent = "The Olympic Charter";
    			t142 = text(" mentions ethical principles and fair play as the Fundamental Principles of Olympism.");
    			t143 = space();
    			p32 = element("p");
    			p32.textContent = "World Baseball Classic (WBC), the most prominent world championship, will be held in the United States, Japan, and Taiwan in March 2023. However, at least four national team members are possibly to tell a lie about their height and weight.";
    			t145 = space();
    			div19 = element("div");
    			div19.textContent = "PUBLISHED 31 DEC, 2022";
    			attr_dev(span, "class", "title-label svelte-fbqxay");
    			add_location(span, file, 20, 34, 783);
    			attr_dev(div0, "class", "title-label-wrapper svelte-fbqxay");
    			add_location(div0, file, 20, 1, 750);
    			attr_dev(h1, "class", "svelte-fbqxay");
    			add_location(h1, file, 21, 1, 837);
    			attr_dev(h4, "class", "sub-title svelte-fbqxay");
    			add_location(h4, file, 22, 1, 864);
    			if (!src_url_equal(img0.src, img0_src_value = /*judgeImg*/ ctx[0])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Aaron Judge's profile on MLB.com");
    			attr_dev(img0, "class", "svelte-fbqxay");
    			add_location(img0, file, 24, 2, 960);
    			attr_dev(div1, "class", "img-credit svelte-fbqxay");
    			add_location(div1, file, 25, 2, 1022);
    			add_location(div2, file, 23, 1, 952);
    			attr_dev(div3, "class", "lead-paragrah svelte-fbqxay");
    			add_location(div3, file, 27, 1, 1133);
    			attr_dev(p0, "class", "paragraph svelte-fbqxay");
    			add_location(p0, file, 28, 1, 1313);
    			attr_dev(p1, "class", "paragraph svelte-fbqxay");
    			add_location(p1, file, 30, 1, 1572);
    			attr_dev(img1, "class", "middle svelte-fbqxay");
    			if (!src_url_equal(img1.src, img1_src_value = /*pHacking*/ ctx[1])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "P-hacking is supposed to exist in academic paper");
    			add_location(img1, file, 31, 6, 1855);
    			add_location(div4, file, 31, 1, 1850);
    			attr_dev(p2, "class", "paragraph svelte-fbqxay");
    			add_location(p2, file, 32, 1, 1955);
    			attr_dev(h20, "class", "header svelte-fbqxay");
    			add_location(h20, file, 33, 1, 2183);
    			attr_dev(p3, "class", "paragraph svelte-fbqxay");
    			add_location(p3, file, 34, 1, 2236);
    			attr_dev(p4, "class", "paragraph svelte-fbqxay");
    			add_location(p4, file, 35, 1, 2423);
    			attr_dev(img2, "class", "middle svelte-fbqxay");
    			if (!src_url_equal(img2.src, img2_src_value = /*lidomHistDouble*/ ctx[2])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "LMB and Minor's data about Dominicans look suspicious");
    			add_location(img2, file, 36, 6, 2572);
    			add_location(div5, file, 36, 1, 2567);
    			attr_dev(p5, "class", "paragraph svelte-fbqxay");
    			add_location(p5, file, 37, 1, 2684);
    			attr_dev(a0, "href", "https://lidom.com/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			add_location(a0, file, 38, 98, 2911);
    			attr_dev(p6, "class", "paragraph svelte-fbqxay");
    			add_location(p6, file, 38, 1, 2814);
    			attr_dev(a1, "href", "http://estadisticas.lidom.com/Miembro/Detalle?idMiembro=533");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			add_location(a1, file, 39, 60, 3150);
    			attr_dev(a2, "href", "https://www.milb.com/player/frank-garces-571057");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener noreferrer");
    			add_location(a2, file, 39, 228, 3318);
    			attr_dev(p7, "class", "paragraph svelte-fbqxay");
    			add_location(p7, file, 39, 1, 3091);
    			attr_dev(a3, "href", "https://www.milb.com/player/emailin-montilla-692983");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener noreferrer");
    			add_location(a3, file, 40, 107, 3605);
    			attr_dev(a4, "href", "http://estadisticas.lidom.com/Miembro/Detalle?idMiembro=3754");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener noreferrer");
    			add_location(a4, file, 40, 280, 3778);
    			attr_dev(p8, "class", "paragraph svelte-fbqxay");
    			add_location(p8, file, 40, 1, 3499);
    			if (!src_url_equal(img3.src, img3_src_value = /*cabreraLidom*/ ctx[3])) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Melky Cabrera’s birthday was born on August 11th 1984, according to the Minor League website");
    			attr_dev(img3, "class", "svelte-fbqxay");
    			add_location(img3, file, 42, 2, 3927);
    			attr_dev(div6, "class", "img-credit svelte-fbqxay");
    			add_location(div6, file, 43, 2, 4055);
    			add_location(div7, file, 41, 1, 3919);
    			attr_dev(p9, "class", "paragraph svelte-fbqxay");
    			add_location(p9, file, 45, 1, 4193);
    			attr_dev(p10, "class", "paragraph svelte-fbqxay");
    			add_location(p10, file, 46, 1, 4353);
    			attr_dev(p11, "class", "paragraph svelte-fbqxay");
    			add_location(p11, file, 47, 1, 4515);
    			if (!src_url_equal(img4.src, img4_src_value = /*cabreraMinor*/ ctx[4])) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Melky Cabrera’s birthday is the eighth of November 1984 on the Dominican league website");
    			attr_dev(img4, "class", "svelte-fbqxay");
    			add_location(img4, file, 49, 2, 4614);
    			attr_dev(div8, "class", "img-credit svelte-fbqxay");
    			add_location(div8, file, 50, 2, 4737);
    			add_location(div9, file, 48, 1, 4606);
    			attr_dev(p12, "class", "paragraph svelte-fbqxay");
    			add_location(p12, file, 52, 1, 4870);
    			attr_dev(p13, "class", "paragraph svelte-fbqxay");
    			add_location(p13, file, 53, 1, 5101);
    			attr_dev(h21, "class", "header svelte-fbqxay");
    			add_location(h21, file, 54, 1, 5277);
    			attr_dev(p14, "class", "paragraph svelte-fbqxay");
    			add_location(p14, file, 55, 1, 5327);
    			attr_dev(p15, "class", "paragraph svelte-fbqxay");
    			add_location(p15, file, 56, 1, 5483);
    			attr_dev(p16, "class", "paragraph svelte-fbqxay");
    			add_location(p16, file, 57, 1, 5650);
    			attr_dev(h22, "class", "header svelte-fbqxay");
    			add_location(h22, file, 59, 1, 5842);
    			attr_dev(p17, "class", "paragraph svelte-fbqxay");
    			add_location(p17, file, 60, 1, 5887);
    			attr_dev(a5, "href", "https://en.cpbl.com.tw/team/person?acnt=0000005731");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noopener noreferrer");
    			add_location(a5, file, 61, 168, 6141);
    			attr_dev(p18, "class", "paragraph svelte-fbqxay");
    			add_location(p18, file, 61, 1, 5974);
    			if (!src_url_equal(img5.src, img5_src_value = /*dykxhoornCplb*/ ctx[5])) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Brock DYKXHOORN is 205 cm (6 feet 9 inches) according to CPBL website");
    			attr_dev(img5, "class", "svelte-fbqxay");
    			add_location(img5, file, 63, 2, 6279);
    			attr_dev(div10, "class", "img-credit svelte-fbqxay");
    			add_location(div10, file, 64, 2, 6385);
    			add_location(div11, file, 62, 1, 6271);
    			attr_dev(a6, "href", "https://www.milb.com/player/brock-dykxhoorn-621245");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noopener noreferrer");
    			add_location(a6, file, 66, 31, 6529);
    			attr_dev(p19, "class", "paragraph svelte-fbqxay");
    			add_location(p19, file, 66, 1, 6499);
    			attr_dev(a7, "href", "http://eng.koreabaseball.com/Teams/PlayerInfoPitcher/Summary.aspx?pcode=69861");
    			attr_dev(a7, "target", "_blank");
    			attr_dev(a7, "rel", "noopener noreferrer");
    			add_location(a7, file, 67, 183, 6915);
    			attr_dev(p20, "class", "paragraph svelte-fbqxay");
    			add_location(p20, file, 67, 1, 6733);
    			if (!src_url_equal(img6.src, img6_src_value = /*dykxhoornMinor*/ ctx[6])) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Brock Dykxhoorn is 6 feet 9 inches (203.2 cm) according to the MLB website");
    			attr_dev(img6, "class", "svelte-fbqxay");
    			add_location(img6, file, 69, 2, 7106);
    			attr_dev(div12, "class", "img-credit svelte-fbqxay");
    			add_location(div12, file, 70, 2, 7218);
    			add_location(div13, file, 68, 1, 7098);
    			attr_dev(h23, "class", "header svelte-fbqxay");
    			add_location(h23, file, 72, 1, 7339);
    			attr_dev(p21, "class", "paragraph svelte-fbqxay");
    			add_location(p21, file, 73, 1, 7398);
    			attr_dev(p22, "class", "paragraph svelte-fbqxay");
    			add_location(p22, file, 74, 1, 7540);
    			attr_dev(h24, "class", "header svelte-fbqxay");
    			add_location(h24, file, 76, 1, 7763);
    			attr_dev(a8, "href", "http://eng.koreabaseball.com/Teams/PlayerInfoHitter/Summary.aspx?pcode=71564");
    			attr_dev(a8, "target", "_blank");
    			attr_dev(a8, "rel", "noopener noreferrer");
    			add_location(a8, file, 77, 147, 7964);
    			attr_dev(p23, "class", "paragraph svelte-fbqxay");
    			add_location(p23, file, 77, 1, 7818);
    			attr_dev(p24, "class", "paragraph svelte-fbqxay");
    			add_location(p24, file, 78, 1, 8129);
    			if (!src_url_equal(img7.src, img7_src_value = /*leeKbo*/ ctx[7])) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "LEE Dae Ho is the heaviest at 130 kg (286.6 pounds) according to the KBO website");
    			attr_dev(img7, "class", "svelte-fbqxay");
    			add_location(img7, file, 80, 2, 8224);
    			attr_dev(div14, "class", "img-credit svelte-fbqxay");
    			add_location(div14, file, 81, 2, 8334);
    			add_location(div15, file, 79, 1, 8216);
    			attr_dev(a9, "href", "https://npb.jp/bis/players/61865135.html");
    			attr_dev(a9, "target", "_blank");
    			attr_dev(a9, "rel", "noopener noreferrer");
    			add_location(a9, file, 83, 69, 8527);
    			attr_dev(a10, "href", "https://www.mlb.com/player/dae-ho-lee-493193");
    			attr_dev(a10, "target", "_blank");
    			attr_dev(a10, "rel", "noopener noreferrer");
    			add_location(a10, file, 83, 184, 8642);
    			attr_dev(p25, "class", "paragraph svelte-fbqxay");
    			add_location(p25, file, 83, 1, 8459);
    			attr_dev(p26, "class", "paragraph svelte-fbqxay");
    			add_location(p26, file, 84, 1, 8836);
    			if (!src_url_equal(img8.src, img8_src_value = /*leeMlb*/ ctx[8])) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "MLB website says Dae-Ho Lee is 250 pounds (113.4 kg)");
    			attr_dev(img8, "class", "svelte-fbqxay");
    			add_location(img8, file, 86, 2, 9027);
    			attr_dev(div16, "class", "img-credit svelte-fbqxay");
    			add_location(div16, file, 87, 2, 9109);
    			add_location(div17, file, 85, 1, 9019);
    			attr_dev(p27, "class", "paragraph svelte-fbqxay");
    			add_location(p27, file, 89, 1, 9206);
    			attr_dev(h25, "class", "header svelte-fbqxay");
    			add_location(h25, file, 90, 1, 9484);
    			attr_dev(a11, "href", "https://www.hawkeyeinnovations.com/");
    			attr_dev(a11, "target", "_blank");
    			attr_dev(a11, "rel", "noopener noreferrer");
    			add_location(a11, file, 91, 97, 9641);
    			attr_dev(p28, "class", "paragraph svelte-fbqxay");
    			add_location(p28, file, 91, 1, 9545);
    			attr_dev(p29, "class", "paragraph svelte-fbqxay");
    			add_location(p29, file, 92, 1, 9833);
    			attr_dev(a12, "href", "https://twitter.com/mike_petriello?ref_src=twsrc%5Etfw");
    			add_location(a12, file, 94, 179, 10242);
    			attr_dev(a13, "href", "https://t.co/uFZYwX4e5z");
    			add_location(a13, file, 94, 273, 10336);
    			attr_dev(a14, "href", "https://t.co/GXMkug7JHp");
    			add_location(a14, file, 94, 335, 10398);
    			attr_dev(p30, "lang", "en");
    			attr_dev(p30, "dir", "ltr");
    			add_location(p30, file, 94, 36, 10099);
    			attr_dev(a15, "href", "https://twitter.com/darenw/status/1320364738526760960?ref_src=twsrc%5Etfw");
    			add_location(a15, file, 94, 435, 10498);
    			attr_dev(blockquote, "class", "twitter-tweet");
    			add_location(blockquote, file, 94, 2, 10065);
    			script.async = true;
    			if (!src_url_equal(script.src, script_src_value = "https://platform.twitter.com/widgets.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "charset", "utf-8");
    			add_location(script, file, 94, 553, 10616);
    			attr_dev(div18, "class", "twitter-embed svelte-fbqxay");
    			add_location(div18, file, 93, 1, 10035);
    			attr_dev(a16, "href", "https://stillmed.olympics.com/media/Document%20Library/OlympicOrg/General/EN-Olympic-Charter.pdf");
    			attr_dev(a16, "target", "_blank");
    			attr_dev(a16, "rel", "noopener noreferrer");
    			add_location(a16, file, 96, 116, 10826);
    			attr_dev(p31, "class", "paragraph svelte-fbqxay");
    			add_location(p31, file, 96, 1, 10711);
    			attr_dev(p32, "class", "paragraph svelte-fbqxay");
    			add_location(p32, file, 97, 1, 11089);
    			attr_dev(div19, "class", "pub-date svelte-fbqxay");
    			add_location(div19, file, 98, 1, 11355);
    			attr_dev(main, "class", "svelte-fbqxay");
    			add_location(main, file, 19, 0, 742);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, span);
    			append_dev(main, t1);
    			append_dev(main, h1);
    			append_dev(main, t3);
    			append_dev(main, h4);
    			append_dev(main, t5);
    			append_dev(main, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(main, t8);
    			append_dev(main, div3);
    			append_dev(main, t10);
    			append_dev(main, p0);
    			append_dev(main, t12);
    			mount_component(scrollyamericaheight, main, null);
    			append_dev(main, t13);
    			append_dev(main, p1);
    			append_dev(main, t15);
    			append_dev(main, div4);
    			append_dev(div4, img1);
    			append_dev(main, t16);
    			append_dev(main, p2);
    			append_dev(main, t18);
    			append_dev(main, h20);
    			append_dev(main, t20);
    			append_dev(main, p3);
    			append_dev(main, t22);
    			append_dev(main, p4);
    			append_dev(main, t24);
    			append_dev(main, div5);
    			append_dev(div5, img2);
    			append_dev(main, t25);
    			append_dev(main, p5);
    			append_dev(main, t27);
    			append_dev(main, p6);
    			append_dev(p6, t28);
    			append_dev(p6, a0);
    			append_dev(p6, t30);
    			append_dev(main, t31);
    			append_dev(main, p7);
    			append_dev(p7, t32);
    			append_dev(p7, a1);
    			append_dev(p7, t34);
    			append_dev(p7, a2);
    			append_dev(p7, t36);
    			append_dev(main, t37);
    			append_dev(main, p8);
    			append_dev(p8, t38);
    			append_dev(p8, a3);
    			append_dev(p8, t40);
    			append_dev(p8, a4);
    			append_dev(p8, t42);
    			append_dev(main, t43);
    			append_dev(main, div7);
    			append_dev(div7, img3);
    			append_dev(div7, t44);
    			append_dev(div7, div6);
    			append_dev(main, t46);
    			append_dev(main, p9);
    			append_dev(main, t48);
    			append_dev(main, p10);
    			append_dev(main, t50);
    			append_dev(main, p11);
    			append_dev(main, t52);
    			append_dev(main, div9);
    			append_dev(div9, img4);
    			append_dev(div9, t53);
    			append_dev(div9, div8);
    			append_dev(main, t55);
    			append_dev(main, p12);
    			append_dev(main, t57);
    			append_dev(main, p13);
    			append_dev(main, t59);
    			append_dev(main, h21);
    			append_dev(main, t61);
    			append_dev(main, p14);
    			append_dev(main, t63);
    			append_dev(main, p15);
    			append_dev(main, t65);
    			append_dev(main, p16);
    			append_dev(main, t67);
    			mount_component(scrollyasianheight, main, null);
    			append_dev(main, t68);
    			append_dev(main, h22);
    			append_dev(main, t70);
    			append_dev(main, p17);
    			append_dev(main, t72);
    			append_dev(main, p18);
    			append_dev(p18, t73);
    			append_dev(p18, a5);
    			append_dev(p18, t75);
    			append_dev(main, t76);
    			append_dev(main, div11);
    			append_dev(div11, img5);
    			append_dev(div11, t77);
    			append_dev(div11, div10);
    			append_dev(main, t79);
    			append_dev(main, p19);
    			append_dev(p19, t80);
    			append_dev(p19, a6);
    			append_dev(p19, t82);
    			append_dev(main, t83);
    			append_dev(main, p20);
    			append_dev(p20, t84);
    			append_dev(p20, a7);
    			append_dev(p20, t86);
    			append_dev(main, t87);
    			append_dev(main, div13);
    			append_dev(div13, img6);
    			append_dev(div13, t88);
    			append_dev(div13, div12);
    			append_dev(main, t90);
    			append_dev(main, h23);
    			append_dev(main, t92);
    			append_dev(main, p21);
    			append_dev(main, t94);
    			append_dev(main, p22);
    			append_dev(main, t96);
    			mount_component(scrollyasianweight, main, null);
    			append_dev(main, t97);
    			append_dev(main, h24);
    			append_dev(main, t99);
    			append_dev(main, p23);
    			append_dev(p23, t100);
    			append_dev(p23, a8);
    			append_dev(p23, t102);
    			append_dev(main, t103);
    			append_dev(main, p24);
    			append_dev(main, t105);
    			append_dev(main, div15);
    			append_dev(div15, img7);
    			append_dev(div15, t106);
    			append_dev(div15, div14);
    			append_dev(main, t108);
    			append_dev(main, p25);
    			append_dev(p25, t109);
    			append_dev(p25, a9);
    			append_dev(p25, t111);
    			append_dev(p25, a10);
    			append_dev(p25, t113);
    			append_dev(main, t114);
    			append_dev(main, p26);
    			append_dev(main, t116);
    			append_dev(main, div17);
    			append_dev(div17, img8);
    			append_dev(div17, t117);
    			append_dev(div17, div16);
    			append_dev(main, t119);
    			append_dev(main, p27);
    			append_dev(main, t121);
    			append_dev(main, h25);
    			append_dev(main, t123);
    			append_dev(main, p28);
    			append_dev(p28, t124);
    			append_dev(p28, a11);
    			append_dev(p28, t126);
    			append_dev(main, t127);
    			append_dev(main, p29);
    			append_dev(main, t129);
    			append_dev(main, div18);
    			append_dev(div18, blockquote);
    			append_dev(blockquote, p30);
    			append_dev(p30, t130);
    			append_dev(p30, a12);
    			append_dev(p30, t132);
    			append_dev(p30, a13);
    			append_dev(p30, t134);
    			append_dev(p30, a14);
    			append_dev(blockquote, t136);
    			append_dev(blockquote, a15);
    			append_dev(div18, t138);
    			append_dev(div18, script);
    			append_dev(main, t139);
    			append_dev(main, p31);
    			append_dev(p31, t140);
    			append_dev(p31, a16);
    			append_dev(p31, t142);
    			append_dev(main, t143);
    			append_dev(main, p32);
    			append_dev(main, t145);
    			append_dev(main, div19);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollyamericaheight.$$.fragment, local);
    			transition_in(scrollyasianheight.$$.fragment, local);
    			transition_in(scrollyasianweight.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollyamericaheight.$$.fragment, local);
    			transition_out(scrollyasianheight.$$.fragment, local);
    			transition_out(scrollyasianweight.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(scrollyamericaheight);
    			destroy_component(scrollyasianheight);
    			destroy_component(scrollyasianweight);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let index, offset, progress;
    	let judgeImg = './images/judge.png';
    	let pHacking = './images/p_hacking.png';
    	let lidomHistDouble = './images/lidom_height_minor.png';
    	let cabreraLidom = './images/cabrera_lidom.png';
    	let cabreraMinor = './images/cabrera_minor.png';
    	let dykxhoornCplb = './images/dykxhoorn_cplb.png';
    	let dykxhoornMinor = './images/dykxhoorn_minor.png';
    	let leeKbo = './images/lee_dae_ho_kbo.png';
    	let leeMlb = './images/lee_dae_ho_mlb.png';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ScrollyAmericaHeight,
    		ScrollyAsianHeight,
    		ScrollyAsianWeight,
    		index,
    		offset,
    		progress,
    		judgeImg,
    		pHacking,
    		lidomHistDouble,
    		cabreraLidom,
    		cabreraMinor,
    		dykxhoornCplb,
    		dykxhoornMinor,
    		leeKbo,
    		leeMlb
    	});

    	$$self.$inject_state = $$props => {
    		if ('index' in $$props) index = $$props.index;
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('progress' in $$props) progress = $$props.progress;
    		if ('judgeImg' in $$props) $$invalidate(0, judgeImg = $$props.judgeImg);
    		if ('pHacking' in $$props) $$invalidate(1, pHacking = $$props.pHacking);
    		if ('lidomHistDouble' in $$props) $$invalidate(2, lidomHistDouble = $$props.lidomHistDouble);
    		if ('cabreraLidom' in $$props) $$invalidate(3, cabreraLidom = $$props.cabreraLidom);
    		if ('cabreraMinor' in $$props) $$invalidate(4, cabreraMinor = $$props.cabreraMinor);
    		if ('dykxhoornCplb' in $$props) $$invalidate(5, dykxhoornCplb = $$props.dykxhoornCplb);
    		if ('dykxhoornMinor' in $$props) $$invalidate(6, dykxhoornMinor = $$props.dykxhoornMinor);
    		if ('leeKbo' in $$props) $$invalidate(7, leeKbo = $$props.leeKbo);
    		if ('leeMlb' in $$props) $$invalidate(8, leeMlb = $$props.leeMlb);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		judgeImg,
    		pHacking,
    		lidomHistDouble,
    		cabreraLidom,
    		cabreraMinor,
    		dykxhoornCplb,
    		dykxhoornMinor,
    		leeKbo,
    		leeMlb
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	/*
    	props: {
    		name: 'world'
    	}
    	*/
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
