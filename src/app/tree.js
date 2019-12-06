import {LitElement, html, css} from 'lit-element';
import './Leaf';

export class Tree extends LitElement{

    static get properties() {
        return {
            data: { type: Object },
        };
    }

    render() {
        return html`
            <custom-leaf .leaf="${this.data}"></custom-leaf>
        `
    }
}

customElements.define('custom-tree', Tree);
