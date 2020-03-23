import { Component } from 'react'
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Legend, Bar } from 'recharts'
import tailwindConfig from '../../../utils/tailwind'
import Downshift from 'downshift'
import Tippy from '@tippy.js/react'
import { scaleTime } from 'd3-scale'
import CaretDownSvg from '../../../../public/icons/caret-down.svg'
import CaretUpSvg from '../../../../public/icons/caret-up.svg'
import moment from 'moment'
import { LoadingComponent } from '../../loading'

const {
  theme: {
    colors: {
      red,
      green,
      brand,
      'brand-dull': brandDull
    }
  }
} = tailwindConfig

interface Props {
  data: any[]
}

const timeframes = [7, 14, 21] as const
type Timeframe = typeof timeframes[number]

interface State {
  timeframe: Timeframe
}

export class DashboardDailyChartComponent extends Component<Props, State> {
  state: State = {
    timeframe: 7 as Timeframe
  }

  filterDataByTimeframe = (data: any[]) => {
    const fromDate = moment().subtract(this.state.timeframe, 'days')
    return data.filter(({ date }) => moment(date, 'YYYY-MM-DD') > fromDate)
  }

  render () {
    const timeframeSelect = (
      <Downshift
        selectedItem={this.state.timeframe}
        onChange={(timeframe: Timeframe) => this.setState({ timeframe })}
      >
        {({
          getItemProps,
          getMenuProps,
          selectedItem,
          isOpen,
          highlightedIndex,
          getRootProps,
          setState
        }) => (
          <div className="select">
            <Tippy
              visible={isOpen}
              animation="shift-away"
              theme="light"
              className="select-list-tooltip"
              allowHTML={true}
              content={(
                <ul
                  {...getMenuProps({}, { suppressRefError: true })}
                  className="select-list"
                >
                  {
                    isOpen
                      ? timeframes
                        .map((timeframe, index) => {
                          return (
                            <li
                              key={index}
                              {...getItemProps({
                                index,
                                item: timeframe
                              })}
                              data-highlighted={highlightedIndex === index}
                              className="select-list-item"
                            >
                              <span className="font-bold">{timeframe} days</span>{' '}
                            </li>
                          )
                        })
                      : ''
                  }
                </ul>
              )}
              arrow={true}
              placement="bottom-start"
              duration={100}
              maxWidth="none"
              trigger="manual"
              onHidden={() => setState({ isOpen: false })}
              interactive
            >
              <div
                {...getRootProps({} as any, { suppressRefError: true })}
                className="select-input-area"
              >
                <button
                  className="btn btn-white flex items-center border border-light rounded px-2 py-1 text-sm"
                  onClick={() => setState({ isOpen: true })}
                >
                  <span className="mr-2">Last {selectedItem} days</span>
                  {
                    isOpen
                      ? (<CaretUpSvg className="h-line-sm" />)
                      : (<CaretDownSvg className="h-line-sm" />)
                  }
                </button>
              </div>
            </Tippy>
          </div>
        )}
      </Downshift>
    )

    return (
      <div className="dashboard-panel select-none">
        <div className="flex items-center mb-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold">
              Daily
            </h2>
          </div>
          <div className="flex items-center justify-end flex-shrink-0 flex-grow-0">
            <div>
              {timeframeSelect}
            </div>
          </div>
        </div>
        <div className="flex flex-col" style={{ height: '360px' }}>
          {(() => {
            if (!Array.isArray(this.props.data)) {
              return (
                <div className="flex flex-1 items-center justify-center">
                  <LoadingComponent className="h-8" />
                </div>
              )
            }
            const fromDate = moment().subtract(this.state.timeframe, 'days')
            const data = this.props.data.filter(({ date }) => moment(date) > fromDate)
            return (
              <ResponsiveContainer>
                <BarChart
                  data={data}
                >
                  <Bar dataKey="cases" name="Cases" fill={brand} isAnimationActive={false} />
                  <Bar dataKey="deaths" name="Deaths" fill={red} isAnimationActive={false} />
                  <Bar dataKey="recovered" name="Recovered" fill={green} isAnimationActive={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke={brandDull} />
                  <XAxis
                    allowDataOverflow
                    dataKey="date"
                    stroke={brand}
                  />
                  <YAxis
                    allowDataOverflow
                    domain={[0, 'dataMax']}
                    stroke={brand}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            )
          })()}
        </div>
      </div>
    )
  }
}