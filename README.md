Stacker
=======

Collects and displays user and content data from Stack Exchange sites. The project can be seen live [**here**](http://codemanteau.com/stacker/).

##Data collection

Two Python files, one for collecting Stack Exchange site identifiers (e.g. Stack Overflow has an ID of 1) and one for scraping data from [the Stack Exchange site index](http://stackexchange.com/sites) and [reputation leagues](http://stackexchange.com/leagues) (for avid user count) can be run manually or scheduled (current implementations utilized a cron job).

*These files are not yet available.*

##Data display

Using Google Charts and utilizing a connection to the database written to by the data collection Python files, the data is outputted in a manner which is easy on the eyes and allows a high level of control over the data displayed. Currently it is only possible to view data for one site at a time, though the dropdown in the index allows easy switching between sites.

##License

You may do whatever you like with this source code or project, on two conditions:

1. You respect all licenses held by components of the project (such as jQuery).
1. You do not claim to be the original creator or owner of any source code or project components you use.
