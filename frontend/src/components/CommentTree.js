import React, { Component } from 'react';
import SubmitComment from './SubmitComment';

class Comment {
    constructor(id, parent, text) {
        this.id = id;
        this.parent = parent;
        this.text = text;
        this.children = [];
    }
}

class CommentTree extends Component {
    // props.arr = comment list, props.parentPost = main post of the page
    constructor(props) {
        super(props);

        this.root_id = props.parentPost;
        var tree = new Map([]);
        tree.set(props.parentPost, new Comment(props.parentPost, '', '')); // root
        this.state = {
            tree: tree
        };

        this.dfsDisplay = this.dfsDisplay.bind(this);
    }

    componentDidUpdate(oldProps) {
        if(oldProps.arr !== this.props.arr){
            /* For every comment in props.arr:
            *    1. Add a new map entry, with key = _id, value = Comment
            *    2. Find its .parent in the map, add to that parent's children
            */
            var tree = new Map([]);
            this.props.arr.forEach(comment => {
                tree.set(comment._id, new Comment(comment._id, comment.parent, comment.content));
                if (comment.parent !== this.root_id && tree.has(comment.parent))
                    tree.get(comment.parent).children.push(comment._id);
            });
            this.setState({tree: tree});
            console.log(tree);
        }
    }

    dfsDisplay(curr, depth, idx) {
        var OFFSET = depth * 20;
        var subComments = [];
        //console.log(curr);
        //console.log(this.state.tree[curr]);
        //console.log(this.state.tree);
        for (var i = 0; i < this.state.tree.get(curr).children.length; ++i) {
            //console.log(curr.children[i]);
            const margin = OFFSET + 'px';
            idx += 2;
            subComments.push(
            <div key={idx} style = {{marginLeft: margin}}>
                {this.dfsDisplay(this.state.tree.get(curr).children[i], depth + 1, idx)}
            </div>);
        }
        idx += 1;
        return (
            <div key={idx}>
                <h3>{this.state.tree.get(curr).text}</h3>
                <SubmitComment id={this.state.tree.get(curr).id} key={idx} />
                {subComments}
            </div>
        );
    }

    render() {
        var commentChains = [];
        var idx = 0;
        this.state.tree.forEach((value) => {
            if (value.parent === this.root_id) { // start dfs from topmost comments
                commentChains.push(this.dfsDisplay(value.id, 0, idx));
                idx += 1000;
            }
        });
        return (
            <div>
                {commentChains}
            </div>
        );
    }
}

export default CommentTree;