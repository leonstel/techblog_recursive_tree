import {LitElement, html, css} from 'lit-element';
import {prepData} from "./utils";

import "./tree";
import {mainStyle} from "../style";

const apiData = require('../data.json');

class MyApp extends LitElement {

    static get styles() {
        return [
            mainStyle,
            css`
                input {
                    width: 300px;
                    height: 30px;
                    border: 2px solid grey;
                    border-radius: 5px;
                    text-align: center; 
                    user-select: none;
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                
                button {
                    height: 36px;
                    border: 1px solid grey;
                    border-radius: 5px;
                    text-align: center; 
                    user-select: none;
                    font-size: 18px;
                    cursor: pointer;
                }
            `
        ];
    }

    static get properties() {
        return {
            data: { type: Object },
            treeEl: { type: Object }
        };
    }

    constructor(){
        super();
        this.data = prepData(apiData);
    }

    firstUpdated() {
        this.treeEl = this.shadowRoot.querySelector('custom-tree');
    }

    render() {
        return html`
            <div>
                <div>
                    <input type="text" @keyup="${this.inputChanged}" placeholder="...">
                    <button @click="${this.closeTree}">Close tree</button>
                    <button @click="${this.openTree}">Open tree</button>
                </div>
                <div>
                    <custom-tree .data="${this.data}"></custom-tree>
                </div>
            </div>
        `;
    }

    closeTree(){
        this.treeEl.closeTree();
    }

    openTree(){
        this.treeEl.openTree();
    }

    inputChanged(e){
        this.treeEl.search(e.target.value);
    }
}

customElements.define('my-app', MyApp);