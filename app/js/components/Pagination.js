var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    FontIcon = require("virt-ui-font_icon"),
    Link = require("virt-ui-link");


var PaginationPrototype;


module.exports = Pagination;


function Pagination(props, children, context) {
    virt.Component.call(this, props, children, context);
}
virt.Component.extend(Pagination, "Pagination");

PaginationPrototype = Pagination.prototype;

Pagination.propTypes = {
    page: propTypes.number.isRequired,
    onNext: propTypes.func.isRequired,
    onPrev: propTypes.func.isRequired
};

Pagination.contextTypes = {
    i18n: propTypes.func.isRequired,
    ctx: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

PaginationPrototype.getStyles = function() {
    var styles = {
        root: {
            position: "relative",
            textAlign: "center"
        },
        prevPage: {
            display: "inline-block"
        },
        prevPageIcon: {
            fontSize: "48px",
            lineHeight: "48px"
        },
        nextPage: {
            display: "inline-block"
        },
        nextPageIcon: {
            fontSize: "48px",
            lineHeight: "48px"
        },
        pageNumber: {
            verticalAlign: "top",
            paddingTop: "12px",
            display: "inline-block"
        },
        number: {
            fontSize: "24px",
            lineHeight: "24px",
            margin: "0px"
        }
    };

    if (this.props.page === 0) {
        styles.prevPage.display = "none";
    }

    return styles;
};

PaginationPrototype.render = function() {
    var styles = this.getStyles(),
        props = this.props;

    return (
        virt.createView("div", {
                className: "Pagination",
                style: styles.root
            },
            virt.createView("div", {
                    style: styles.prevPage
                },
                virt.createView(Link, {
                        onClick: props.onPrev
                    },
                    virt.createView(FontIcon, {
                        style: styles.prevPageIcon,
                        className: "material-icons"
                    }, "keyboard_arrow_left")
                )
            ),
            virt.createView("div", {
                    style: styles.pageNumber
                },
                virt.createView("p", {
                        style: styles.number
                    },
                    props.page
                )
            ),
            virt.createView("div", {
                    style: styles.nextPage
                },
                virt.createView(Link, {
                        onClick: props.onNext
                    },
                    virt.createView(FontIcon, {
                        style: styles.nextPageIcon,
                        className: "material-icons"
                    }, "keyboard_arrow_right")
                )
            )
        )
    );
};