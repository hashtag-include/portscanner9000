# portscanner9000

A cli remote port scanner with service name lookup. Install it with `npm install -g portscanner9000`.

# usage

> By default (that is, without any arguments) the tool scans all [bengreenier/well-known-ports](https://github.com/bengreenier/well-known-ports) on `localhost`.

Any/all of the options can be repeated without issue including `[hostname]`.
That is, passing `bengreenier.com` and `trjast.com` will scan both hosts.
Likewise, multiple ranges and ports are supported (like `-r 1..10 -r 20..25`).

```
Usage: portscanner9000|ps9 [options] [hostname]

a cli remote port scanner with service name lookup

Options:

  -h, --help              output usage information
  -V, --version           output the version number
  -r, --range [<a>..<b>]  A port range to scan
  -p, --port [port]       A port to scan
```

# examples

```
# look for open ports between 20 and 22 (inclusive) on host bengreenier.com
portscanner9000 -r 20..22 bengreenier.com
```

```
# look for open port 80 on hosts bengreenier.com and trjast.com
portscanner9000 -p bengreenier.com trjast.com
```

# License

MIT