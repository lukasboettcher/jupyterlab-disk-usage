FROM jupyter/minimal-notebook

COPY --chown=1000:100 disk_usage-0.1.0-py3-none-any.whl .

RUN pip install jupyter-resource-usage disk_usage-0.1.0-py3-none-any.whl