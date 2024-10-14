# Web Workers Project - API Fetching & Expiry Handling

## Overview

Welcome to my Web Workers project! 🎉 This mini project shows how I’ve used two Web Workers to handle API fetching and stale data management for a table with pagination.

## Features

- **Worker 1: API Fetcher**  
  This worker fetches data from an API, builds a table, and stores the data in `sessionStorage` to keep things snappy. You don’t have to reload the data all the time—it’s saved locally for you!
  
- **Worker 2: Expiry Worker**  
  The second worker monitors the data, and when it gets stale, it automatically refetches the expired pages. This way, the table always stays up-to-date, without any manual refreshes.

- **Interactive Pagination**  
  You can interact with the table by choosing how many items you want to see per page. The workers handle the rest behind the scenes, making sure everything stays responsive and fresh!

## Contributing

Got ideas for improvements or want to make it even more efficient? Feel free to contribute and help make this project even better!

---

Check it out, play with the pagination, and watch the workers do their magic! 🚀
