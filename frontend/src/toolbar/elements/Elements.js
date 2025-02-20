import './Elements.scss'

import React from 'react'
import { useActions, useValues } from 'kea'
import { heatmapLogic } from '~/toolbar/elements/heatmapLogic'
import { dockLogic } from '~/toolbar/dockLogic'
import { FocusRect } from '~/toolbar/elements/FocusRect'
import { InfoWindow } from '~/toolbar/elements/InfoWindow'
import { HeatmapElement } from '~/toolbar/elements/HeatmapElement'
import { HeatmapLabel } from '~/toolbar/elements/HeatmapLabel'
import { elementsLogic } from '~/toolbar/elements/elementsLogic'
import { getBoxColors } from '~/toolbar/utils'

export function Elements() {
    const { domZoom, domPadding, mode } = useValues(dockLogic)
    const {
        heatmapElements,
        elementsToDisplay,
        labelsToDisplay,
        hoverElement,
        selectedElement,
        inspectEnabled,
        highlightElementMeta,
    } = useValues(elementsLogic)
    const { setHoverElement, selectElement } = useActions(elementsLogic)
    const { highestClickCount } = useValues(heatmapLogic)

    return (
        <>
            {mode === 'dock' ? null : (
                <div
                    id="posthog-infowindow-container"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: '2147483021',
                        pointerEvents: 'none',
                    }}
                >
                    <InfoWindow />
                </div>
            )}
            <div
                id="posthog-toolbar-elements"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: '2147483010',
                    pointerEvents: 'none',
                }}
            >
                {highlightElementMeta ? <FocusRect rect={highlightElementMeta.rect} /> : null}

                {elementsToDisplay.map(({ rect, element }, index) => (
                    <HeatmapElement
                        key={`inspect-${index}`}
                        rect={rect}
                        domPadding={domPadding}
                        domZoom={domZoom}
                        style={{
                            pointerEvents: 'all',
                            cursor: 'pointer',
                            zIndex: 0,
                            opacity:
                                (!hoverElement && !selectedElement) ||
                                selectedElement === element ||
                                hoverElement === element
                                    ? 1
                                    : 0.4,
                            transition: 'opacity 0.2s, box-shadow 0.2s',
                            ...getBoxColors('blue', hoverElement === element || selectedElement === element),
                        }}
                        onClick={() => selectElement(element)}
                        onMouseOver={() => setHoverElement(element)}
                        onMouseOut={() => setHoverElement(null)}
                    />
                ))}

                {heatmapElements.map(({ rect, count, element }, index) => {
                    return (
                        <React.Fragment key={`heatmap-${index}`}>
                            <HeatmapElement
                                rect={rect}
                                domPadding={domPadding}
                                domZoom={domZoom}
                                style={{
                                    pointerEvents: inspectEnabled ? 'none' : 'all',
                                    zIndex: 1,
                                    opacity: !hoverElement || hoverElement === element ? 1 : 0.4,
                                    transition: 'opacity 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    ...getBoxColors('red', hoverElement === element, (count / highestClickCount) * 0.4),
                                }}
                                onClick={() => selectElement(element)}
                                onMouseOver={() => setHoverElement(element)}
                                onMouseOut={() => setHoverElement(null)}
                            />
                            <HeatmapLabel
                                rect={rect}
                                domPadding={domPadding}
                                domZoom={domZoom}
                                style={{
                                    pointerEvents: 'all',
                                    zIndex: 5,
                                    opacity: hoverElement && hoverElement !== element ? 0.4 : 1,
                                    transition: 'opacity 0.2s, transform 0.2s linear',
                                    transform: hoverElement === element ? 'scale(1.3)' : 'none',
                                    cursor: 'pointer',
                                }}
                                onClick={() => selectElement(element)}
                                onMouseOver={() => setHoverElement(element)}
                                onMouseOut={() => setHoverElement(null)}
                            >
                                {index + 1}
                            </HeatmapLabel>
                        </React.Fragment>
                    )
                })}

                {labelsToDisplay.map(({ element, rect, index }, loopIndex) => {
                    return (
                        <HeatmapLabel
                            key={`label-${loopIndex}`}
                            rect={rect}
                            domPadding={domPadding}
                            domZoom={domZoom}
                            align="left"
                            style={{
                                zIndex: 5,
                                opacity: hoverElement && hoverElement !== element ? 0.4 : 1,
                                transition: 'opacity 0.2s, transform 0.2s linear',
                                transform: hoverElement === element ? 'scale(1.3)' : 'none',
                                pointerEvents: 'all',
                                cursor: 'pointer',
                                color: 'hsla(141, 21%, 12%, 1)',
                                background: 'hsl(147, 100%, 62%)',
                                boxShadow: 'hsla(141, 100%, 32%, 1) 0px 1px 5px 1px',
                            }}
                            onClick={() => selectElement(element)}
                            onMouseOver={() => setHoverElement(element)}
                            onMouseOut={() => setHoverElement(null)}
                        >
                            {index + 1}
                        </HeatmapLabel>
                    )
                })}
            </div>
        </>
    )
}
