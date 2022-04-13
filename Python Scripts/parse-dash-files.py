import json



def load_dashboards(files=[]):
    """
    Reads in list of Sisense dashboard files to be parsed
    Requires list of .JSON (or .DASH) files formatted like ['file1.dash', 'file2.json']
    Returns a list of the dashboards formatted as dictionaries
    """
    result = []
    for f in files:
        with open(f) as json_data:
            result.append(json.load(json_data))
    return result



def identify_columns(dashboards=[]):
    """
    Compiles a list of every table.column used by widgets & filters for a list of dashboards
    Requires list of dictionaries of Sisense dashboard metadata, ie Sisense .dash files
    Note: does not account for additional columns used to create Sisense Custom Tables or Custom Columns
    Returns a dictionary of one table.column list per data model
    """
    result = {}
    
    for dash in dashboards:
        widgets = dash['widgets']
        filters = dash['filters']
        datasources = list(set([w['datasource']['id'] for w in widgets] + [f['jaql']['datasource']['id'] for f in filters]))

        for d in datasources:
            if d not in result.keys():
                result[d] = {'columns': []}

        for w in widgets:
            datasource = w['datasource']['id']
            panels = w['metadata']['panels']
            for p in panels:
                items = p['items']
                for i in items:
                    jaql = i['jaql']
                    if 'dim' in jaql.keys():
                        column = jaql['dim']
                        if column not in result[datasource]['columns']:
                            result[datasource]['columns'].append(column)
                            
        for f in filters:
            jaql = f['jaql']
            datasource = jaql['datasource']['id']
            if 'dim' in jaql.keys():
                column = jaql['dim']
                if column not in result[datasource]['columns']:
                    result[datasource]['columns'].append(column)

    return result