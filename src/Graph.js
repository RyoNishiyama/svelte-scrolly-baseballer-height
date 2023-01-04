import * as d3 from 'd3';
import { appendSelect } from 'd3-appendselect';
import _ from 'lodash-es';
d3.selection.prototype.appendSelect = appendSelect;

class Graph {
  selection(selector) {
    if (!selector) return this._selection;
    this._selection = d3.select(selector);
    return this;
  }

  data(newData) {
    if (!newData) return this._data || this.defaultData;
    this._data = newData;
    return this;
  }

  props(newProps) {
    if (!newProps) return this._props || this.defaultProps;
    this._props = _.merge(this._props || this.defaultProps, newProps);
    return this;
  }

  defaultData = [];
  defaultProps = {}
	
	// This is also supposed to be responsive
	setGraph() {
		const data = this.data();
		const { width, height, index } = this.props();
			
		// Dimentions - make sure you export anything needed later with a this.
		this.margin = { top: 20, right: 20, bottom: 20, left: 20 }
		this.boundedWeight = width - this.margin.left - this.margin.right
		this.boundedHeight = height - this.margin.top - this.margin.bottom
		
		// Scales 
    this.xScale = d3.scaleBand()
      .domain(data.map(d => d.pounds))
      .range([0, this.boundedWeight])
      .paddingInner(0.3)

		this.yScale = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.mlb)])
			.range([this.boundedHeight, 0])
				
		// Container 
		this.svg = this.selection()
			.appendSelect('svg')
			.attr('width', width)
			.attr('height', height)
			.classed('svg', true)

		this.plot = this.svg
			.appendSelect('g.plot')
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
			.call(d3.axisLeft(this.yScale))
			.appendSelect('g.plot')
			.attr('transform', `translate(0, ${this.boundedHeight})`)
			.call(d3.axisBottom(this.xScale))

		// Inital plot - this will get drawn on step 0 
		this.plotInitial = this.plot.selectAll('.bar')
			.data(data)
			.join(
				enter => {
					return enter.append('rect')
						.attr('height', 10)
				},
				update => {
					return update
					.interrupt()
						.transition()
						.duration(300)
						.attr('height', 10)
				},
				exit => exit
				)
			.classed('bar', true)
			.attr('x', d => this.xScale(d.pounds))
			.attr('y', -10)
			.attr('width', this.xScale.bandwidth())
      .attr('height', 10)
			.style('fill', '#1380A1')
			console.log(index);
			return this;
	}

	// Logic for update on step 1 - make the bars expand 
	stepOneLogic() {
		this.plotInitial
			.interrupt()
			.transition()
      .duration(300)
      .attr('y', d => this.yScale(d.mlb) - this.boundedHeight)
			.attr('height', d => this.boundedHeight - this.yScale(d.mlb))
		return this
	}
	
	// Logic for update on step 2 - change the colour of the bars
	stepTwoLogic() {
		this.plotInitial
			.interrupt()
			.transition()
      .duration(300)
      .attr('y', d => this.yScale(d.lmb) - this.boundedHeight)
			.attr('height', d => this.boundedHeight - this.yScale(d.lmb))
	}
	
	// Logic for update on step 2 - change the colour of the bars
	stepThreeLogic() {
		this.plotInitial
			.interrupt()
			.transition()
			.duration(300)
			.attr('y', d => this.yScale(d.lidom) - this.boundedHeight)
			.attr('height', d => this.boundedHeight - this.yScale(d.lidom))
	}
}

export default Graph