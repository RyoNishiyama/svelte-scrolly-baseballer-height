import _ from 'lodash-es';
let data = [
	{
			"pounds": 60,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 61,
			"mlb": 0,
			"lmb": 0,
			"lidom": 6
	},
	{
			"pounds": 62,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 63,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 64,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 65,
			"mlb": 0,
			"lmb": 1,
			"lidom": 0
	},
	{
			"pounds": 66,
			"mlb": 3,
			"lmb": 3,
			"lidom": 1
	},
	{
			"pounds": 67,
			"mlb": 3,
			"lmb": 5,
			"lidom": 0
	},
	{
			"pounds": 68,
			"mlb": 18,
			"lmb": 5,
			"lidom": 0
	},
	{
			"pounds": 69,
			"mlb": 20,
			"lmb": 11,
			"lidom": 3
	},
	{
			"pounds": 70,
			"mlb": 92,
			"lmb": 13,
			"lidom": 7
	},
	{
			"pounds": 71,
			"mlb": 111,
			"lmb": 20,
			"lidom": 12
	},
	{
			"pounds": 72,
			"mlb": 206,
			"lmb": 28,
			"lidom": 35
	},
	{
			"pounds": 73,
			"mlb": 229,
			"lmb": 19,
			"lidom": 16
	},
	{
			"pounds": 74,
			"mlb": 289,
			"lmb": 18,
			"lidom": 23
	},
	{
			"pounds": 75,
			"mlb": 256,
			"lmb": 10,
			"lidom": 20
	},
	{
			"pounds": 76,
			"mlb": 172,
			"lmb": 9,
			"lidom": 15
	},
	{
			"pounds": 77,
			"mlb": 88,
			"lmb": 3,
			"lidom": 5
	},
	{
			"pounds": 78,
			"mlb": 40,
			"lmb": 1,
			"lidom": 1
	},
	{
			"pounds": 79,
			"mlb": 16,
			"lmb": 0,
			"lidom": 2
	},
	{
			"pounds": 80,
			"mlb": 5,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 81,
			"mlb": 1,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 82,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 83,
			"mlb": 1,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 84,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	},
	{
			"pounds": 85,
			"mlb": 0,
			"lmb": 0,
			"lidom": 0
	}
]

data = _.sortBy(data, d => d.number).reverse()
export default data