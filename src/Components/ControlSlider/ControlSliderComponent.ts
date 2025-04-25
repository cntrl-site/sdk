import { ControlSlider } from './ControlSlider';

export const ControlSliderComponent = {
  element: ControlSlider,
  id: 'control-slider',
  name: 'Slider',
  defaultSize: {
    width: 400,
    height: 400
  },
  schema: {
    type: 'object',
    properties: {
      settings: {
        layoutBased: true,
        type: 'object',
        properties: {
          triggers: {
            name: 'triggers',
            icon: 'target',
            type: 'object',
            properties: {
              triggersList: {
                type: 'object',
                display: {
                  type: 'toggle-ratio-group',
                },
                properties: {
                  click: {
                    type: 'boolean',
                  },
                  drag: {
                    type: 'boolean',
                  }
                }
              },
              autoPlay: {
                type: ['string', 'null'],
                display: {
                  type: 'setep-selector',
                },
                enum: [null, '1s', '2s', '3s', '4s', '5s'],
              }
            }
          },
          direction: {
            name: 'direction',
            icon: 'horizontal-resize',
            type: 'string',
            display: {
              type: 'direction-enum'
            },
            enum: ['horizontal', 'vertical']
          },
          controls: {
            name: 'controls',
            icon: 'controls',
            type: 'object',
            properties: {
              isActive: {
                type: 'boolean',
                display: {
                  type: 'setting-toggle',
                }
              },
              arrowsImgUrl: {
                type: ['string', 'null'],
                display: {
                  type: 'settings-image-input',
                },
              },
              offset: {
                type: 'object',
                display: {
                  type: 'offset-controls',
                },
                properties: {
                  x: {
                    type: 'number',
                  },
                  y: {
                    type: 'number',
                  }
                }
              },
              scale: {
                type: 'number',
                name: 'scale',
                min: 50,
                max: 600,
                display: {
                  type: 'range-control',
                },
              },
              color: {
                name: 'color',
                type: 'string',
                display: {
                  type: 'settings-color-picker',
                  format: 'single'
                }
              },
              hover: {
                name: 'hover',
                type: 'string',
                display: {
                  type: 'settings-color-picker',
                  format: 'single'
                },
              }
            },
          },
          pagination: {
            name: 'nav',
            icon: 'pagination',
            type: 'object',
            properties: {
              isActive: {
                type: 'boolean',
                display: {
                  type: 'setting-toggle',
                }
              },
              position: {
                name: 'nav position',
                display: {
                  type: 'socket',
                  direction: 'horizontal',
                },
                type: 'string',
                enum: ['outside-1', 'outside-2', 'inside-1', 'inside-2'],
              },
              offset: {
                type: 'object',
                display: {
                  type: 'offset-controls',
                },
                properties: {
                  x: {
                    type: 'number',
                  },
                  y: {
                    type: 'number',
                  }
                }
              },
              scale: {
                type: 'number',
                name: 'scale',
                min: 10,
                max: 400,
                display: {
                  type: 'range-control',
                },
              },
              colors: {
                display: {
                  type: 'settings-color-picker',
                  format: 'multiple'
                },
                name: 'color',
                type: 'array',
                items: {
                  type: 'string',
                }
              },
              hover: {
                name: 'hover',
                type: 'string',
                display: {
                  type: 'settings-color-picker',
                  format: 'single'
                }
              }
            }
          },
          caption: {
            name: 'desc',
            icon: 'text-icon',
            type: 'object',
            properties: {
              isActive: {
                type: 'boolean',
                display: {
                  type: 'setting-toggle',
                }
              },
              alignment: {
                name: 'Alignment',
                type: 'string',
                display: {
                  type: 'align-grid'
                },
                enum: ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right']
              },
              offset: {
                type: 'object',
                display: {
                  type: 'offset-controls',
                },
                properties: {
                  x: {
                    type: 'number',
                  },
                  y: {
                    type: 'number',
                  }
                }
              },
              hover: {
                name: 'hover',
                type: 'string',
                display: {
                  type: 'settings-color-picker',
                  format: 'single'
                }
              }
            }
          }
        },
        default: {
          triggers: {
            triggersList: {
              click: true,
              drag: true,
            },
            autoPlay: null,
          },
          controls: {
            isActive: true,
            arrowsImgUrl: null,
            offset: {
              x: 0,
              y: 0
            },
            scale: 100,
            color: '#000000',
            hover: '#cccccc',
          },
          pagination: {
            isActive: true,
            scale: 50,
            position: 'outside-1',
            offset: {
              x: 0,
              y: 0
            },
            colors: ['#000000', '#cccccc'],
            hover: '#cccccc'
          },
          direction: 'horizontal',
          caption: {
            offset: {
              x: 0,
              y: 0
            },
            isActive: true,
            alignment: 'middle-center',
            hover: '#cccccc'
          }
        },
        displayRules: [
          {
            if: {
              name: 'direction',
              value: 'vertical'
            },
            then: {
              name: 'properties.pagination.properties.position.display.direction',
              value: 'vertical'
            }
          }
        ]
      },
      content: {
        layoutBased: false,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            image: {
              type: 'object',
              display: {
                type: 'media-input',
              },
              properties: {
                url: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                }
              },
              required: ['url', 'name']
            },
            imageCaption: {
              display: {
                type: 'rich-text',
                placeholder: 'Add Caption...',
              }
            },
            link: {
              type: 'object',
              display: {
                type: 'text-input',
                placeholder: 'Add Caption...',
              },
              properties: {
                text: {
                  type: 'string'
                },
              }
            },
          },
          required: ['image']
        },
        default: [
          {
            image: {
              url: 'https://cdn.cntrl.site/projects/01GJ2SMPPCQ7JSNGVXZ2DHWXWF/articles-assets/01JRZ15T247392621FNTTRCW9D.jpeg',
              name: 'Slider-1.jpeg'
            },
            imageCaption: [
              {
                type: 'paragraph',
                children: [{ text: '' }]
              }
            ]
          },
          {
            image: {
              url: 'https://cdn.cntrl.site/projects/01GJ2SMPPCQ7JSNGVXZ2DHWXWF/articles-assets/01JRZ17S8TS9T62P7NKTNNEB64.jpeg',
              name: 'Slider-2.jpeg'
            },
            imageCaption: [
              {
                type: 'paragraph',
                children: [{ text: '' }]
              }
            ]
          },
          {
            image: {
              url: 'https://cdn.cntrl.site/projects/01GJ2SMPPCQ7JSNGVXZ2DHWXWF/articles-assets/01JRZ197S89RNT6RA7ZJSX3Z38.jpeg',
              name: 'Slider-3.jpeg'
            },
            imageCaption: [
              {
                type: 'paragraph',
                children: [{ text: '' }]
              }
            ]
          }
        ]
      },
      styles: {
        layoutBased: true,
        type: 'object',
        properties: {
          caption: {
            dataName: 'caption',
            type: 'object',
            properties: {
              fontSettings: {
                type: 'object',
                display: {
                  type: 'font-settings',
                },
                properties: {
                  fontFamily: {
                    type: 'string',
                  },
                  fontWeight: {
                    type: 'number',
                  },
                  fontStyle: {
                    type: 'string',
                  }
                }
              },
              widthSettings: {
                display: {
                  type: 'text-width-control',
                },
                type: 'object',
                properties: {
                  width: {
                    type: 'number',
                  },
                  sizing: {
                    type: 'string',
                    enum: ['auto', 'manual'],
                  }
                }
              },
              fontSizeLineHeight: {
                type: 'object',
                display: {
                  type: 'font-size-line-height',
                },
                properties: {
                  fontSize: {
                    type: 'number',
                  },
                  lineHeight: {
                    type: 'number',
                  }
                }
              },
              letterSpacing: {
                display: {
                  type: 'letter-spacing-input',
                },
                type: 'number',
              },
              wordSpacing: {
                display: {
                  type: 'word-spacing-input',
                },
                type: 'number',
              },
              textAlign: {
                display: {
                  type: 'text-align-control',
                },
                type: 'string',
                enum: ['left', 'center', 'right', 'justify'],
              },
              textAppearance: {
                display: {
                  type: 'text-appearance',
                },
                properties: {
                  textTransform: {
                    type: 'string',
                    enum: ['none', 'uppercase', 'lowercase', 'capitalize'],
                  },
                  textDecoration: {
                    type: 'string',
                    enum: ['none', 'underline'],
                  },
                  fontVariant: {
                    type: 'string',
                    enum: ['normal', 'small-caps'],
                  },
                }
              },
              color: {
                display: {
                  type: 'style-panel-color-picker',
                },
                type: 'string',
              }
            }
          }
        },
        default: {
          caption: {
            widthSettings: {
              width: 0.13,
              sizing: 'auto',
            },
            fontSettings: {
              fontFamily: 'Arial',
              fontWeight: 400,
              fontStyle: 'normal',
            },
            fontSizeLineHeight: {
              fontSize: 0.02,
              lineHeight: 0.02
            },
            letterSpacing: 0,
            wordSpacing: 0,
            textAlign: 'left',
            textAppearance: {
              textTransform: 'none',
              textDecoration: 'none',
              fontVariant: 'normal',
            },
            color: '#000000'
          }
        }
      },
    },
    required: ['settings', 'content', 'styles']
  }
};
