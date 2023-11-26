import { createTheme } from '@mui/material'
import { enUS, jaJP, Localization, viVN } from '@mui/material/locale'
import { blue, grey, primaryColor, PrimaryColors, secondaryColor } from './colors'

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        textBold: true
    }
}

type localeType = {
    [key: string]: Localization
}

const locale: localeType = {
    vi: viVN,
    en: enUS,
    ja: jaJP
}

const language = localStorage.getItem('language') || 'en'

const defaultTheme = createTheme(
    {
        palette: {
            primary: {
                main: PrimaryColors[600],
                light: blue[300]
            },
            background: {
                default: '#FAFAFA'
            },
            secondary: {
                main: primaryColor,
                light: secondaryColor
            },
            grey: {
                900: grey[900],
                600: grey[600],
                500: grey[500],
                300: grey[300],
                200: grey[200],
                100: grey[100],
                50: grey[50]
            },
            success: {
                main: '#219653'
            },
            warning: {
                main: '#FC8059'
            }
        },
        typography: {
            fontFamily: ['Lato', 'sans-serif'].join(', '),
            h1: {
                fontSize: '60px',
                lineHeight: '68px'
            },
            h2: {
                fontSize: '48px',
                lineHeight: '56px'
            },
            h3: {
                fontSize: '36px',
                lineHeight: '40px'
            },
            h4: {
                fontSize: '30px',
                lineHeight: '36px'
            },
            h5: {
                fontSize: '24px',
                lineHeight: '30px'
            },
            h6: {
                fontSize: '20px',
                lineHeight: '28px'
            },
            subtitle1: {
                fontSize: '18px',
                lineHeight: '26px'
            },
            body1: {
                fontSize: '16px',
                lineHeight: '22px'
            },
            body2: {
                fontSize: '14px',
                lineHeight: '20px'
            },
            caption: {
                fontSize: '12px',
                lineHeight: '18px'
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        textTransform: 'none'
                    },
                    text: {
                        padding: 0,
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }
                },
                defaultProps: {
                    disableRipple: true
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: '10px'
                    }
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: '16px'
                    }
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: '6px',
                        paddingLeft: '5px',
                        paddingRight: '5px'
                    },
                    deleteIcon: {
                        fontSize: '18px',
                        position: 'absolute',
                        top: '-5px',
                        right: '-10px',
                        zIndex: 10
                    },
                    deletable: {
                        marginRight: '5px'
                    }
                }
            }
        }
    },
    locale[language]
)

export { defaultTheme }
