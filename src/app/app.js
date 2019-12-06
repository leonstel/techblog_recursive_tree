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

    render() {
        return html`
            <custom-tree .data="${this.data}"></custom-tree>
        `;
    }
}

customElements.define('my-app', MyApp);