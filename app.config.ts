export default defineAppConfig({
    ui: {
        colors: {
            primary: 'teal',
            neutral: 'slate',
            tertiary: 'indigo',
            info: 'sky',
            secondary: 'blue',
            success: 'green',
            warning: 'yellow',
            error: 'red'
        },
        navigationMenu: {
            slots: {
                root: '',
                list: 'space-y-2',
                label: '',
                item: '',
                link: '',
                linkLeadingIcon: '',
                linkLeadingAvatar: '',
                linkLeadingAvatarSize: '',
                linkTrailing: '',
                linkTrailingBadge: '',
                linkTrailingBadgeSize: '',
                linkTrailingIcon: '',
                linkLabel: '',
                linkLabelExternalIcon: '',
                childList: '',
                childLabel: '',
                childItem: '',
                childLink: '',
                childLinkWrapper: '',
                childLinkIcon: '',
                childLinkLabel: '',
                childLinkLabelExternalIcon: '',
                childLinkDescription: '',
                separator: '',
                viewportWrapper: '',
                viewport: '',
                content: '',
                indicator: '',
                arrow: ''
            },
            variants: {
                active: {
                    true: {
                        link: 'bg-turquoise-500 !text-white !rounded-md !font-medium !text-base hover:!bg-black',
                        linkLeadingIcon: '!text-white',
                    },
                    false: {
                        link: 'text-black hover:bg-turquoise-500 hover:!text-white hover:rounded-md font-medium text-base',
                        linkLeadingIcon: 'text-black group-hover:!text-white',
                    }
                },
                disabled: {},
                highlight: {
                    true: ''
                },
                level: {
                    true: ''
                },
                collapsed: {
                    true: ''
                }
            },
            compoundVariants: [],
            defaultVariants: {}
        },
        drawer: {
            slots: {
                overlay: 'fixed inset-0 bg-primary/30 backdrop-blur'
            }
        },
        modal: {
            slots: {
                body: 'flex-1 overflow-y-auto sm:p-4',
            }
        },
    }
})