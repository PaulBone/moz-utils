//
// A 2-3-4-tree
//

(function (global) {
    Node = {}
    EmptyNode = Object.create(Node, {'type': {'value': 'empty' }});
    Node2 = Object.create(Node, {'type': {'value': '2node' }});
    Node3 = Object.create(Node, {'type': {'value': '3node' }});
    Node4 = Object.create(Node, {'type': {'value': '4node' }});

    function error(msg) {
        throwError(msg);
    }

    function assert(expr) {
        if (expr === undefined) {
            error("Undefined");
        }
    }

    function node2(key, value, left, right) {
        assert(left);
        assert(right);
        return Object.create(Node2, {
            'k0': {'value': key},
            'v0': {'value': value},
            'b0': {'value': left},
            'b1': {'value': right},
        });
    }

    function node3(k0, v0, k1, v1, b0, b1, b2) {
        assert(b0);
        assert(b1);
        assert(b2);
        return Object.create(Node3, {
            'k0': {'value': k0 },
            'v0': {'value': v0 },
            'k1': {'value': k1 },
            'v1': {'value': v1 },
            'b0': {'value': b0 },
            'b1': {'value': b1 },
            'b2': {'value': b2 },
        });
    }

    function node4(k0, v0, k1, v1, k2, v2, b0, b1, b2, b3) {
        assert(b0);
        assert(b1);
        assert(b2);
        assert(b3);
        return Object.create(Node4, {
            'k0': {'value': k0 },
            'v0': {'value': v0 },
            'k1': {'value': k1 },
            'v1': {'value': v1 },
            'k2': {'value': k2 },
            'v2': {'value': v2 },
            'b0': {'value': b0 },
            'b1': {'value': b1 },
            'b2': {'value': b2 },
            'b3': {'value': b3 },
        });
    }

    function node2_set(tree, k, v) {
        if (tree.k0 == k) {
            return node2(k, v, tree.b0, tree.b1);
        }

        if (tree.b0.type == 'empty') {
            // By definition both branches are empty.
            if (k < tree.k0) {
                return node3(k, v, tree.k0, tree.v0,
                    EmptyNode, EmptyNode, EmptyNode);
            } else {
                return node3(tree.k0, tree.v0, k, v,
                    EmptyNode, EmptyNode, EmptyNode);
            }
        } else {
            if (k < tree.k0) {
                if (tree.b0.type == '4node') {
                    return node_split_set(tree.b0, k, v, tree);
                } else {
                    return node2(tree.k0, tree.v0,
                        node_set_part2(tree.b0, k, v), tree.b1);
                }
            } else {
                if (tree.b1.type == '4node') {
                    return node_split_set(tree.b1, k, v, tree);
                } else {
                    return node2(tree.k0, tree.v0,
                        tree.b0, node_set_part2(tree.b1, k, v));
                }
            }
        }
    }

    function node3_set(tree, k, v) {
        if (tree.k0 == k) {
            return node3(k, v, tree.k1, tree.v1, tree.b0, tree.b1, tree.b2);
        }
        if (tree.k1 == k) {
            return node3(tree.k0, tree.v0, k, v, tree.b0, tree.b1, tree.b2);
        }

        if (tree.b0.type == 'empty') {
            // By definition all branches are empty.
            if (k < tree.k0) {
                return node4(k, v, tree.k0, tree.v0, tree.k1, tree.v1,
                    EmptyNode, EmptyNode, EmptyNode, EmptyNode);
            } else if (k < tree.k1) {
                return node4(tree.k0, tree.v0, k, v, tree.k1, tree.v1,
                    EmptyNode, EmptyNode, EmptyNode, EmptyNode);
            } else {
                return node4(tree.k0, tree.v0, tree.k1, tree.v1, k, v,
                    EmptyNode, EmptyNode, EmptyNode, EmptyNode);
            }
        } else {
            if (k < tree.k0) {
                if (tree.b0.type == '4node') {
                    return node_split_set(tree.b0, k, v, tree);
                } else {
                    return node3(tree.k0, tree.v0, tree.k1, tree.v1,
                        node_set_part2(tree.b0, k, v), tree.b1, tree.b2);
                }
            } else if (k < tree.k1) {
                if (tree.b1.type == '4node') {
                    return node_split_set(tree.b1, k, v, tree);
                } else {
                    return node3(tree.k0, tree.v0, tree.k1, tree.v1,
                        tree.b0, node_set_part2(tree.b1, k, v), tree.b2);
                }
            } else {
                if (tree.b2.type == '4node') {
                    return node_split_set(tree.b2, k, v, tree);
                } else {
                    return node3(tree.k0, tree.v0, tree.k1, tree.v1,
                        tree.b0, tree.b1, node_set_part2(tree.b2, k, v));
                }
            }
        }
    }

    function node4_set(tree, k, v) {
        if (tree.k0 == k) {
            return node4(k, v, tree.k1, tree.v1, tree.k2, tree.v2,
                tree.b0, tree.b1, tree.b2, tree.b3);
        }
        if (tree.k1 == k) {
            return node4(tree.k0, tree.v0, k, v, tree.k2, tree.v2,
                tree.b0, tree.b1, tree.b2, tree.b3);
        }
        if (tree.k2 == k) {
            return node4(tree.k0, tree.v0, tree.k1, tree.v1, k, v,
                tree.b0, tree.b1, tree.b2, tree.b3);
        }

        if (tree.b0.type == 'empty') {
            error("Cannot insert into a 4-node that is a leaf");
        } else {
            if (k < tree.k0) {
                if (tree.b0.type == '4node') {
                    error("A child of a 4-node can't be a 4-node");
                } else {
                    return node4(tree.k0, tree.v0,
                            tree.k1, tree.v1,
                            tree.k2, tree.v2,
                            node_set_part2(tree.b0, k, v),
                            tree.b1,
                            tree.b2,
                            tree.b3);
                }
            } else if (k < tree.k1) {
                if (tree.b1.type == '4node') {
                    error("A child of a 4-node can't be a 4-node");
                } else {
                    return node4(tree.k0, tree.v0,
                            tree.k1, tree.v1,
                            tree.k2, tree.v2,
                            tree.b0,
                            node_set_part2(tree.b1, k, v),
                            tree.b2,
                            tree.b3);
                }
            } else if (k < tree.k2) {
                if (tree.b2.type == '4node') {
                    error("A child of a 4-node can't be a 4-node");
                } else {
                    return node4(tree.k0, tree.v0,
                            tree.k1, tree.v1,
                            tree.k2, tree.v2,
                            tree.b0,
                            tree.b1,
                            node_set_part2(tree.b2, k, v),
                            tree.b3);
                }
            } else {
                if (tree.b3.type == '4node') {
                    error("A child of a 4-node can't be a 4-node");
                } else {
                    return node4(tree.k0, tree.v0,
                            tree.k1, tree.v1,
                            tree.k2, tree.v2,
                            tree.b0,
                            tree.b1,
                            tree.b2,
                            node_set_part2(tree.b3, k, v));
                }
            }
        }
    }

    function node_set(tree, k, v, up) {
        if (tree.type == '4node') {
            return node_split_set(tree, k, v, up);
        } else {
            return node_set_part2(tree, k, v);
        }
    }

    function node_split_set(tree, k, v, up) {
        left = node2(tree.k0, tree.v0, tree.b0, tree.b1);
        right = node2(tree.k2, tree.v2, tree.b2, tree.b3);
        mid_k = tree.k1;
        mid_v = tree.v1;

        if (up) {
            return node_set_part2(merge(up, mid_k, mid_v, left, right), k, v);
        } else {
            // This is the root node.
            return node_set_part2(node2(mid_k, mid_v, left, right),
                k, v);
        }
    }

    function node_set_part2(tree, k, v) {
        switch (tree.type) {
            case 'empty':
                return node2(k, v, EmptyNode, EmptyNode);
            case '2node':
                return node2_set(tree, k, v);
            case '3node':
                return node3_set(tree, k, v);
            case '4node':
                return node4_set(tree, k, v);
            default:
                error("Unhandled node");
        }
    }

    function merge(up, k, v, left, right) {
        switch (up.type) {
            case 'empty':
                error("Empty node in merge");
            case '2node':
                if (k < up.k0) {
                    // In each of these cases a branch is being "dropped",
                    // that's the branch being "rotated from", in this case
                    // it's b0,
                    return node3(k, v, up.k0, up.v0, left, right, up.b1);
                } else {
                    return node3(up.k0, up.v0, k, v, up.b0, left, right);
                }
            case '3node':
                if (k < up.k0) {
                    return node4(k, v, up.k0, up.v0, up.k1, up.v1,
                        left, right, up.b1, up.b2);
                } else if (k < up.k1) {
                    return node4(up.k0, up.v0, k, v, up.k1, up.v1,
                        up.b0, left, right, up.b2);
                } else {
                    return node4(up.k0, up.v0, up.k1, up.v1, k, v,
                        up.b0, up.b1, left, right);
                }
            case '4node':
                error("Can't merge into 4node");
        }
    }

    function get(tree, k) {
        switch (tree.type) {
            case 'empty':
                break;
            case '2node':
                if (k < tree.k0) {
                    return get(tree.b0, k);
                } else {
                    return get(tree.b1, k);
                }
            case '3node':
                if (k < tree.k0) {
                    return get(tree.b0, k);
                } else if (k < tree.k1) {
                    return get(tree.b1, k);
                } else {
                    return get(tree.b2, k);
                }
            case '4node':
                if (k < tree.k0) {
                    return get(tree.b0, k);
                } else if (k < tree.k1) {
                    return get(tree.b1, k);
                } else if (k < tree.k2) {
                    return get(tree.b2, k);
                } else {
                    return get(tree.b3, k);
                }
        }
    }

    function traverse(tree, f) {
        switch (tree.type) {
            case 'empty':
                return;
            case '2node':
                traverse(tree.b0, f);
                f(tree.k0, tree.v0);
                traverse(tree.b1, f);
                return;
            case '3node':
                traverse(tree.b0, f);
                f(tree.k0, tree.v0);
                traverse(tree.b1, f);
                f(tree.k1, tree.v1);
                traverse(tree.b2, f);
                return;
            case '4node':
                traverse(tree.b0, f);
                f(tree.k0, tree.v0);
                traverse(tree.b1, f);
                f(tree.k1, tree.v1);
                traverse(tree.b2, f);
                f(tree.k2, tree.v2);
                traverse(tree.b3, f);
                return;
        }
    }

    global.Tree234 = {
        empty: () => EmptyNode,
        set: (tree, k, v) => {
            return node_set(tree, k, v, undefined);
        },
        get: get,
        traverse: traverse,
    };
})(this);

