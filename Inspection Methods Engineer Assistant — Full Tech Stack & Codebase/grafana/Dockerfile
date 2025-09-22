FROM grafana/grafana:10.0.3

# Copy provisioning files
COPY ./provisioning/datasources /etc/grafana/provisioning/datasources
COPY ./provisioning/dashboards /etc/grafana/provisioning/dashboards

# Copy dashboards
COPY ./dashboards /etc/grafana/dashboards

# Set environment variables
ENV GF_SECURITY_ADMIN_USER=admin
ENV GF_SECURITY_ADMIN_PASSWORD=admin
ENV GF_USERS_ALLOW_SIGN_UP=false