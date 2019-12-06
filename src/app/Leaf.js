import {LitElement, html, css} from 'lit-element';
import {mainStyle} from "../style";

export class Leaf extends LitElement{

    static get styles() {
        return [
            mainStyle,
            css`
                .node {
                    position: relative;
                    height: 50px;
                    width: 0;
                    cursor: pointer;
                }
            
                .item  {
                    position: absolute;
                    display: flex;
                    margin-left: 25px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .item p {
                    margin: 0;
                }
                
                .arrow {
                    position: absolute;
                    width: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .down {
                    transform: rotateZ(90deg);
                }
                
                .checkbox {
                    position: relative;
                    padding-left: 40px;
                }
                
                .checkbox input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }
                
                .custom-checkbox{
                    position: absolute;
                    left: 8px;
                    height: 25px;
                    width: 25px;
                    background-color: #eee;
                    top: -15%;
                }
                
                .mark{
                    position: absolute;
                    top: 50%;
                    left: 8px;
                    height: 25px;
                    width: 25px;
                    transform: translate(0,-50%);
                }               
                
                .checkbox:hover input ~ .checkmark {
                    background-color: #ccc;
                }
                
                .checkbox input:checked ~ .checkmark {
                    background-color: #2196F3;
                }
                
                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }

                .checkbox input:checked ~ .checkmark:after {
                    display: block;
                }
                
                .checkbox .checkmark:after {
                    left: 9px;
                    top: 5px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 3px 3px 0;
                    -webkit-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
                /* test*/
                
                
                
                .checkbox .indeterminate ~ .indeterminate-mark:after {
                    display: block;
                }
                
                .checkbox .indeterminate ~ .checkmark {
                    background-color: #2196F3;
                }
                
                .indeterminate-mark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }
                
                .checkbox .indeterminate-mark:after {
                    left: 9px;
                    top: 5px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 3px 0 0;
                    -webkit-transform: rotate(90deg);
                    -ms-transform: rotate(90deg);
                    transform: rotate(90deg);
                }
                
                .hide {
                    display:none;
                }
                
                .underline {
                    text-decoration: underline;
                }
            `
        ];
    }

    static get properties() {
        return {
            leaf: { type: Object },
            childrenRef: { type: Array },
        };
    }

    constructor(parentRef){
        super();
        this.parentRef = parentRef;
        this.childrenRef = [];
    }

    firstUpdated(_changedProperties) {
        this.leafChanged();
    }

    updated(_changedProperties) {
        if(_changedProperties.has('leaf')){
            this.leafChanged();
        }
    }

    render() {
        return html`
            ${this.leaf ? html`
                ${
                    this.leaf.name ? html`
                        <div class="node">                            
                            <div class="item">
                                <p>${this.leaf.name}</p>
                            </div>
                        </div>
                    `: ''
                }
                <div>
                    ${this.hasChildren() ? this.renderChildren() : ''}
                </div>
            `: ''}
        `
    }

    leafChanged(){
        if(this.leaf.children)
            this.childrenRef = this.leaf.children.map(leafData => {
                const leaf = new Leaf(this);
                leaf.leaf = leafData;
                return leaf;
            });
    }

    renderChildren(){
        return html`
            <ul>
                ${this.childrenRef.map(leaf => html`
                    ${leaf}
                `)}
            </ul>
        `
    }

    hasChildren(){
        return !!this.childrenRef.length;
    }
}

customElements.define('custom-leaf', Leaf);